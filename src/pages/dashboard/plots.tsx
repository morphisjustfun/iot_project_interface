import {
    Container,
    Text,
    Grid,
    useInput,
    Input,
    Dropdown,
    Spacer,
    Divider,
    useTheme,
    Button,
    Switch
} from "@nextui-org/react";
import {useState} from "react";
import {PrismaClient} from "@prisma/client";
import LoadingModal from "@/components/loading_modal";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    Filler, ChartType, ChartOptions,
} from "chart.js";
import dynamic from "next/dynamic";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, RadialLinearScale);

import DataShow from "@/components/data_show";
import {useQuery} from "react-query";
import TextModal from "@/components/text_modal";

interface PlotsProp {
    runIds: String[]
}

interface Data {
    time: string;
    endoAvg: number;
    endoSd: number;
    heartAvg: number;
    heartSd: number;
}

export default function Plots(props: PlotsProp) {

    const [selectedRunId, setSelectedRunId] = useState<String | undefined>(undefined);
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [pauseAutoRefetch, setPauseAutoRefetch] = useState(false);
    const [showInfoDialog, setShowInfoDialog] = useState(false);

    // const [data, setData] = useState<Data[] | undefined>(undefined);
    const {isLoading, isSuccess, error, status, data, isRefetching} = useQuery(
        ['fetch', selectedRunId], async () => {
            if (selectedRunId === undefined) {
                return;
            }
            const res = await fetch('/api/get_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({runId: selectedRunId})
            });
            const data = await res.json();
            return data.data;
        },
        {
            refetchInterval: 8000,
            refetchIntervalInBackground: true,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            refetchOnMount: true,
            enabled: !pauseAutoRefetch && selectedRunId !== undefined
        }
    );

    const dataset1 = {
        datasets: [
            {
                label: 'Dataset 1',
                data: data?.map((value) => {
                    return {
                        x: value.time,
                        y: value.endoAvg
                    }
                }),
                borderColor: 'rgba(47, 97, 68, 1)',
                pointStyle: 'circle',
                pointRadius: data?.map((value) => {
                    return 20 * (value.endoSd / value.endoAvg)
                }),
                showLine: true,
            }
        ],
    };

    const dataset2 = {
        datasets: [
            {
                label: 'Dataset 1',
                data: data?.map((value) => {
                    return {
                        x: value.time,
                        y: value.heartAvg
                    }
                }),
                borderColor: 'rgba(47, 97, 68, 1)',
                pointStyle: 'circle',
                pointRadius: data?.map((value) => {
                    return 20 * (value.heartSd / value.heartAvg)
                }),
                showLine: true,
            }
        ]
    };


    const options1: ChartOptions<ChartType> = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x',
                },
                zoom: {
                    pinch: {
                        enabled: true
                    },
                    wheel: {
                        enabled: true
                    },
                    mode: 'x',
                }
            }
        },
        elements: {
            line: {
                tension: 0,
                borderWidth: 4,
                borderColor: 'rgba(47, 97, 68, 1)',
            },
            point: {
                hitRadius: 30
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (ms)',
                    font: {
                        size: 18,
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Heart Value',
                    font: {
                        size: 18,
                    }
                }
            },
        },
    }

    const options2: ChartOptions<ChartType> = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x',
                },
                zoom: {
                    pinch: {
                        enabled: true
                    },
                    wheel: {
                        enabled: true
                    },
                    mode: 'x',
                }
            }
        },
        elements: {
            line: {
                tension: 0,
                borderWidth: 4,
                borderColor: 'rgba(47, 97, 68, 1)',
            },
            point: {
                hitRadius: 30
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (ms)',
                    font: {
                        size: 18,
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Endo Value',
                    font: {
                        size: 18,
                    }
                }
            },
        },
    }

    const MyChart = dynamic(() => import('@/components/data_show'), {ssr: false});

    // @ts-ignore
    return (
        <Container display="flex" css={{
            overflowY: 'visible'
        }}>
            <LoadingModal visible={isLoading} title="Retrieving data"/>
            <LoadingModal visible={isLoading || isRefetching} title="Retrieving data"/> :
            <TextModal visible={showInfoDialog} setVisible={setShowInfoDialog} title="Details"
                       message={[
                           "(1) Identify the interval of interest (e.g., a scene of tension or realiation)",
                           "(2) Zoom or scroll internally in the chart",
                           "(3) Check if there is a change in the interval in relation to the neighboring points. In addition to the change in value, you can identify variations in the radius of the circles, which represent the dispersion",
                           "* Note that the values shown are approximations of every 32 seconds",
                           "* Heart Value: A value equivalent to BPM",
                           "* Endo Value: The voltage resulting from using human skin as a resistor"
                       ]} width={500}/>
            <Grid.Container direction="column" justify="center" alignItems="center">
                <Spacer y={3}/>
                <Text h1> Data visualization </Text>
                <Spacer y={1}/>
                <Dropdown>
                    <Dropdown.Button
                        flat> {selectedRunId !== undefined ? selectedRunId : 'Select'} </Dropdown.Button>
                    <Dropdown.Menu>
                        {
                            props.runIds.map((runId, index) => {
                                return (
                                    <Dropdown.Item key={index}>
                                        <div onClick={async () => {
                                            try {
                                                setSelectedRunId(runId);
                                            } finally {
                                            }
                                        }}>
                                            {runId}
                                        </div>
                                    </Dropdown.Item>
                                );
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>
                <Spacer y={1}/>
                <Button auto onPress={() => setShowInfoDialog(true)} color="gradient"> What is this about? </Button>
                <Spacer y={1}/>
                <Container justify="center" alignItems="center" display="flex">
                    <Text> Pause auto refetch </Text>
                    <Spacer y={1}/>
                    <Switch checked={pauseAutoRefetch} onChange={(e) => {
                        setPauseAutoRefetch(e.target.checked);
                    }}/>
                </Container>
                {
                    isLoading || isRefetching ? <></> :
                        data !== undefined ? <>
                            {/*<DataShow data1={dataset1} data2={dataset2} options={options} height={50} />*/}
                            {/* @ts-ignore */}
                            <MyChart data1={dataset1} data2={dataset2} options1={options1} options2={options2}
                                     height={50}/>
                        </> : <></>
                }
                <Spacer y={3}/>
            </Grid.Container>
        </Container>
    );
}


export async function getServerSideProps() {
    const prisma = new PrismaClient();
    const data = await prisma.data.findMany({
        select: {
            runId: true
        },
        distinct: ['runId']
    });
    // get all runId inside data
    const runIds = data.map(d => d.runId);

    const props: PlotsProp = {
        runIds: runIds
    }

    return {
        props: props
    }
}