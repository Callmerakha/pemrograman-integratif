import paho.mqtt.client as mqtt

def on_message(client, userdata, message):
    print("Received message: " ,str(message.payload.decode("utf-8")))

client = mqtt.Client()

client.connect("localhost",1883,60)

client.subscribe("topic/test")

client.on_message=on_message 

client.loop_forever() 
