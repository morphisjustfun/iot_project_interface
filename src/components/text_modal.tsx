import {Modal, Text, Container} from "@nextui-org/react";

interface TextModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    title: string;
    message: string;
}

export default function TextModal(props: TextModalProps) {
    return (
        <Modal open={props.visible} onClose={() => props.setVisible(false)}>
            <Modal.Header>
                <Text h3> {props.title} </Text>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Text h5> {props.message} </Text>
                </Container>
            </Modal.Body>
        </Modal>
    );
}
