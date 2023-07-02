import {Container, Grid, Input, Text, Spacer, Button, useInput} from "@nextui-org/react";
import {useState} from "react";
import LoadingModal from "@/components/loading_modal";
import TextModal from "@/components/text_modal";

const auth = async (email: string, password: string) => {
    const user = {
        email: email,
        password: password
    };

    // use api/auth_user.ts
    try {
        const res = await fetch("/api/auth_user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
        return res.ok;
    } catch (e) {
        return false;
    }
}

const LoginForm = () => {
    const {value: email, bindings: bindingsEmail} = useInput("");
    const {value: password, bindings: bindingsPassword} = useInput("");

    const [loadingVisible, setLoadingVisible] = useState(false);
    const [loadingErrorLogin, setLoadingErrorLogin] = useState(false);

    return (
        <>
            <LoadingModal visible={loadingVisible} title="Signing In..."/>
            <TextModal visible={loadingErrorLogin} setVisible={setLoadingErrorLogin} title="Error"
                       message="Invalid email or password."/>
            <Input {...bindingsEmail} placeholder="Enter your email" width="300px" shadow label="Email"/>
            <Spacer y={0.8}/>
            <Input.Password {...bindingsPassword} placeholder="Enter your password" width="300px" shadow
                            label="Password"/>
            <Spacer y={1.3}/>
            <Button auto color="gradient" css={{
                width: "300px"
            }} onPress={async () => {
                setLoadingVisible(true);
                const success = await auth(email, password);
                setLoadingVisible(false);
                if (success) {
                    return;
                }
                setLoadingErrorLogin(true);
            }}>Sign In</Button>
        </>
    );
}

export default function Home() {
    return (
        <Container fluid display="flex" css={{
            height: "100%"
        }}>
            <Grid.Container direction="column" justify="center" alignItems="center">
                <Grid.Container direction="column" justify="center" alignItems="center">
                    <Text h1 css={{
                        textGradient: "45deg, $blue600 -20%, $pink600 50%"
                    }}>
                        FeelQuest
                    </Text>
                    <Text h2>
                        Empowering Indie Game Evolution
                    </Text>
                </Grid.Container>
                <Spacer y={3}/>
                <Grid.Container direction="column" justify="center" alignItems="center">
                    <LoginForm/>
                </Grid.Container>
            </Grid.Container>
        </Container>
    )
}
