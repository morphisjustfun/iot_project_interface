import type {MqttClient, IClientOptions} from 'mqtt'
import mqtt from 'mqtt';
import {DependencyList, useEffect, useRef} from 'react'

interface useMqttProps {
    uri: string
    options?: IClientOptions
    topicHandlers: { topic: string; handler: (payload: any) => void }[]
    onConnectedHandler: (client: MqttClient) => void,
    onErrorHandler: (error: any) => void
}

function useMqtt(props: useMqttProps, deps: DependencyList = []) {
    const options = props.options === undefined ? {} : props.options;


    const clientRef = useRef<MqttClient | null>(null)
    useEffect(() => {
        if (clientRef.current) return
        if (!props.topicHandlers || props.topicHandlers.length === 0) return () => {
        }

        try {
            clientRef.current = options
                ? mqtt.connect(props.uri, options)
                : mqtt.connect(props.uri)
        } catch (error) {
            console.error('error', error)
        }

        const client = clientRef.current
        props.topicHandlers.forEach((th) => {
            client?.subscribe(th.topic)
        })

        client?.on('message', (topic: string, rawPayload: any, packet: any) => {
            const th = props.topicHandlers.find((t) => t.topic === topic)
            let payload
            try {
                payload = JSON.parse(rawPayload)
            } catch {
                payload = rawPayload
            }
            if (th) th.handler({topic, payload, packet})
        })

        client?.on('connect', () => {
            props.onConnectedHandler(client);
        })

        client?.on('error', (error) => {
            props.onErrorHandler(error);
        });

        return () => {
            if (client) {
                props.topicHandlers.forEach((th) => {
                    client.unsubscribe(th.topic)
                })
                client.end()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

export default useMqtt;
