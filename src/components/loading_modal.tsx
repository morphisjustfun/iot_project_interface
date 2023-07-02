import {Modal, Text, Row, Loading, Container} from "@nextui-org/react";

interface LoadingModalProps {
    visible: boolean;
    title: string;
}

export default function LoadingModal(props: LoadingModalProps) {
    return (
        <Modal open={props.visible} preventClose>
            <Modal.Header>
                <Text h3> {props.title} </Text>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row justify="center">
                        <Loading/>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
}
