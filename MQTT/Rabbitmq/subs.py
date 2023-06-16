import paho.mqtt.client as mqtt

# Fungsi callback ketika pesan diterima
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))

client = mqtt.Client()
client.on_message = on_message

client.connect("localhost", 1883, 60)

client.subscribe("test/topic")

client.loop_forever()
