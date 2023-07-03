import {Container, Grid, Input, Text, Spacer, Button, useInput, Table} from "@nextui-org/react";
import {useState, useRef, useEffect} from "react";
import type {MqttClient, Packet} from 'mqtt'
import useMqtt from "@/hooks/use_mqtt";
import mqtt from "mqtt";
import TextModal from "@/components/text_modal";
import LoadingModal from "@/components/loading_modal";
import {randomUUID} from "crypto";
import {run} from "node:test";
import {useRouter} from "next/navigation";

interface MessagePayloadInterface {
    endo_avg: number;
    endo_sd: number;
    heart_avg: number;
    heart_sd: number;
    time: number;
}

interface MessageInterface {
    packed: Packet;
    topic: string;
    payload: MessagePayloadInterface;
}

export default function Dashboard() {
    let [selectedTopic, setSelectedTopic] = useState<String | undefined>(undefined);
    const {value: topicName, setValue: setTopicName, bindings: bindingsTopicName} = useInput("");
    const [showErrorTopicName, setShowErrorTopicName] = useState(false);
    const router = useRouter();

    return (
        <Container fluid display="flex" css={{
            height:
                "100%"
        }}>
            <TextModal visible={showErrorTopicName} setVisible={setShowErrorTopicName} title="Error"
                       message="Invalid topic name."/>
            <Grid.Container direction="row" alignItems="center">
                <Grid.Container xs={3}>
                    <Grid.Container direction="column" justify="center" alignItems="center">
                        <Text h3>
                            Topic name
                        </Text>
                        <Text h4>
                            {
                                selectedTopic === undefined ? "No topic selected" : selectedTopic
                            }
                        </Text>
                        <Spacer y={1}/>
                        <Input
                            {...bindingsTopicName}
                            placeholder="Enter your topic name" width="300px" shadow label="Topic name"/>
                        <Spacer y={1}/>
                        <Button auto color="gradient" css={{
                            width: "300px"
                        }} onPress={async () => {
                            if (topicName === "") {
                                setShowErrorTopicName(true);
                                return;
                            }
                            setSelectedTopic(undefined);
                            await new Promise(resolve => setTimeout(resolve, 10));
                            setSelectedTopic(topicName);
                            setTopicName("");
                        }}>Subscribe</Button>
                        <Spacer y={1}/>
                        <Button auto color="gradient" css={{
                            width: "300px"
                        }} onPress={() => {
                            setSelectedTopic(undefined);
                        }}>Unsubscribe</Button>
                        <Spacer y={1}/>
                        <Button auto color="gradient" css={{
                            width: "300px"
                        }} onPress={() => {
                            router.push("/dashboard/plots");
                        }}>Dashboard</Button>
                    </Grid.Container>
                </Grid.Container>
                <Grid.Container xs={9}>
                    {
                        selectedTopic !== undefined ? <DashboardContent topic={selectedTopic!}/> :
                            <Container>
                                <Text h3 css={{
                                    textAlign: "center"
                                }}> No ha seleccionado un tópico </Text>
                            </Container>
                    }
                </Grid.Container>
            </Grid.Container>
        </Container>
    )
}

interface DashboardContentProps {
    topic: String;
}

const DashboardContent = (props: DashboardContentProps) => {
    const [errorLogin, setErrorLogin] = useState(false);
    const [successLogin, setSuccessLogin] = useState(false);
    const [loadingVisible, setLoadingVisible] = useState(true);
    const [dataReceived, setDataReceived] = useState<MessagePayloadInterface[]>([]);

    const formatDate = (date: Date) => {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }
    const runId = useRef(formatDate(new Date()));

    const incommingMessageHandler = useRef([
        {
            topic: `feel_quest/${props.topic}`,
            handler: (message: MessageInterface) => {
                try {
                    const payload = message.payload;
                    payload.endo_avg = parseFloat(payload.endo_avg.toFixed(3));
                    payload.endo_sd = parseFloat(payload.endo_sd.toFixed(3));
                    payload.heart_avg = parseFloat(payload.heart_avg.toFixed(3));
                    payload.heart_sd = parseFloat(payload.heart_sd.toFixed(3));
                    setDataReceived((prev) => {
                        return [...prev, payload]
                    });
                    // post data to server /api/post_data
                    fetch("/api/post_data", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            runId: runId.current,
                            topic: props.topic,
                            endoAvg: payload.endo_avg,
                            endoSd: payload.endo_sd,
                            heartAvg: payload.heart_avg,
                            heartSd: payload.heart_sd,
                            time: payload.time,
                        })
                    });
                } catch (e) {

                }
            }
        }
    ]);
    const mqttClientRef = useRef<MqttClient | null>(null)
    const setMqttClient =
        (client: MqttClient) => {
            mqttClientRef.current = client
        }

    useMqtt({
        uri: 'wss://mqtt.eclipseprojects.io/mqtt',
        options: {
            port: 443,
        },
        topicHandlers: incommingMessageHandler.current,
        onConnectedHandler: (client) => {
            console.log("Connected to broker");
            setMqttClient(client);
            setLoadingVisible(false);
            setSuccessLogin(true);
        },
        onErrorHandler: (error) => {
            setLoadingVisible(false);
            setErrorLogin(true);
        },
    });

    return (
        <Container css={{
            paddingLeft: 60,
            paddingRight: 60,
        }}>
            <LoadingModal visible={loadingVisible} title="Connecting to broker..."/>
            <TextModal visible={errorLogin} title="Error" message="Error connecting to broker. Please try again."
                       setVisible={setErrorLogin}/>
            <TextModal visible={successLogin} title="Success" message="Connected to broker."
                       setVisible={setSuccessLogin}/>
            <Table
                shadow
                bordered
                css={{
                    width: "100%"
                }}>
                <Table.Header>
                    <Table.Column> Endo Avg </Table.Column>
                    <Table.Column> Endo SD </Table.Column>
                    <Table.Column> Heart Avg </Table.Column>
                    <Table.Column> Heart SD </Table.Column>
                    <Table.Column> Time (S) </Table.Column>
                </Table.Header>
                <Table.Body>
                    {
                        dataReceived.map((data, index) => {
                            return (
                                <Table.Row key={data.time}>
                                    <Table.Cell>{data.endo_avg}</Table.Cell>
                                    <Table.Cell>{data.endo_sd}</Table.Cell>
                                    <Table.Cell>{data.heart_avg}</Table.Cell>
                                    <Table.Cell>{data.heart_sd}</Table.Cell>
                                    <Table.Cell>{data.time / 1000}</Table.Cell>
                                </Table.Row>
                            )
                        })
                    }
                </Table.Body>
                <Table.Pagination shadow noMargin align="center" rowsPerPage={10}/>
            </Table>
        </Container>
    );
}
