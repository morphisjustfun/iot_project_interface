import {Container, Grid, Input, Text, Spacer, Button, useInput} from "@nextui-org/react";
import {useState, useRef} from "react";
import type {MqttClient} from 'mqtt'
import useMqtt from "@/hooks/use_mqtt";

export default function Dashboard() {
    let [selectedTopic, setSelectedTopic] = useState<String | undefined>(undefined);
    const {value: topicName, bindings: bindingsTopicName} = useInput("");

    const incommingMessageHandler = useRef([
        {
            topic: "my_topic",
            message: "message1",
            handler: (message: string) => {
                console.log(message);
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
            // ignore invalid SSL certificates
        },
        topicHandlers: incommingMessageHandler.current,
        onConnectedHandler: (client) => setMqttClient(client),
    });

    return (
        <Container fluid display="flex" css={{
            height:
                "100%"
        }}>
            <Grid.Container direction="row" alignItems="center">
                <Grid.Container xs={6}>
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
                        }}>Subscribe</Button>
                        <Spacer y={1}/>
                        <Button auto color="gradient" css={{
                            width: "300px"
                        }}>Unsubscribe</Button>
                    </Grid.Container>
                </Grid.Container>
                <Grid.Container xs={6}>
                    <Text h1> Mario </Text>
                </Grid.Container>
            </Grid.Container>
        </Container>
    )
}
