import paho.mqtt.client as mqtt

# Fungsi callback ketika koneksi berhasil
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    client.publish("test/topic", "Hello MQTT")

client = mqtt.Client()
client.on_connect = on_connect

client.connect("localhost", 1883, 60)

client.loop_forever()
