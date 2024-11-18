let mqttClient;

window.addEventListener("load", () => {
  const statusInput = document.getElementById("status");

  // Connect to the MQTT broker
  connectToBroker();

  let receivedPong = true;

  // Send periodic pings
  setInterval(() => {
    if (!receivedPong) {
      statusInput.value = "Process failure detected!";
    } else {
      statusInput.value = "Process alive";
    }
    receivedPong = false; // Reset before the next ping
    mqttClient.publish("ping", "ping");
  }, 5000); // Ping every 5 seconds

  // Listen for pong messages
  mqttClient.on("message", (topic, message) => {
    if (topic === "pong" && message.toString() === "pong") {
      receivedPong = true;
    }
  });
});

function connectToBroker() {
  const clientId = "detector" + Math.random().toString(36).substring(7);
  const host = "ws://192.168.79.52:9001/mqtt"; // Update with your broker's address

  mqttClient = mqtt.connect(host, {
    clientId,
    keepalive: 60,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
  });

  mqttClient.on("connect", () => {
    console.log("Connected to broker");
    mqttClient.subscribe("pong", () => {
      console.log("Subscribed to pong topic");
    });
  });

  mqttClient.on("error", (err) => {
    console.error("Connection error: ", err);
  });
}
