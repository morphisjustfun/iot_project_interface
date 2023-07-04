import {Modal, Text, Container} from "@nextui-org/react";

interface TextModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    title: string;
    message: string | string[];
    width: number | undefined;
}

export default function TextModal(props: TextModalProps) {
    return (
        <Modal open={props.visible} onClose={() => props.setVisible(false)} width={props.width}>
            <Modal.Header>
                <Text h3> {props.title} </Text>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    {typeof props.message === "string" ? <Text h5 css={{
                        whiteSpace: "pre-wrap"
                    }}> {props.message} </Text> : props.message.map((m, i) => <Text key={i + 1000000} h5 css={{
                        whiteSpace: "pre-wrap"
                    }}> {m} </Text>)}
                </Container>
            </Modal.Body>
        </Modal>
    );
}
