import {
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    ChartType, Filler, Legend,
    LinearScale,
    LineElement,
    PointElement, RadialLinearScale, Title, Tooltip
} from "chart.js";
import {Button, Container, Divider, Spacer} from "@nextui-org/react";
import {Scatter} from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import {useRef} from "react";

ChartJS.register(zoomPlugin);

interface Data {
    time: string;
    endoAvg: number;
    endoSd: number;
    heartAvg: number;
    heartSd: number;
}

const DataShow = (props: { data1: Data[], data2: Data[], options: ChartOptions<ChartType>, height: number }) => {
    const chartRef1 = useRef(null);
    const chartRef2 = useRef(null);

    const handleResetZoom1 = () => {
        if (chartRef1 && chartRef1.current) {
            // @ts-ignore
            chartRef1.current!.resetZoom();
        }
    }

    const handleResetZoom2 = () => {
        if (chartRef2 && chartRef2.current) {
            // @ts-ignore
            chartRef2.current!.resetZoom();
        }
    }

    return (<><Divider y={5}/>
        <Container>
            <Container justify="flex-end" alignItems="center" display="flex">
                <Button auto onPress={handleResetZoom1} color="gradient">Reset</Button>
            </Container>
            <Spacer y={1}/>
            {/*// @ts-ignore*/}
            <Scatter data={props.data1} options={props.options} height={props.height} ref={chartRef1}/>
        </Container>
        <Divider y={5}/>
        <Container>
            <Container justify="flex-end" alignItems="center" display="flex">
                <Button auto onPress={handleResetZoom2} color="gradient">Reset</Button>
            </Container>
            <Spacer y={1}/>
            {/*// @ts-ignore*/}
            <Scatter data={props.data2} options={props.options} height={props.height} ref={chartRef2}/>
        </Container></>)
}

export default DataShow;