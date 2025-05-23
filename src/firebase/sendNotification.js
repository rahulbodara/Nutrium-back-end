const admin = require("firebase-admin");

// Ensure private key is defined
const privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (!privateKey) {
  throw new Error("Missing FIREBASE_PRIVATE_KEY in environment variables.");
}

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: privateKey.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (fcmTokens, receiverId, message, senderName) => {
  if (!Array.isArray(fcmTokens) || fcmTokens.length === 0) {
    console.log("No FCM tokens provided.");
    return;
  }

  const messages = fcmTokens.map((token) => ({
    token,
    notification: {
      title: senderName || "NutriumFit",
      body: message || "You have received a new message",
    },
    data: {
      receiverId: receiverId?.toString() || "",
      message: message || "",
      click_action: "FLUTTER_NOTIFICATION_CLICK",
      sound: "default",
      status: "done",
      screen: "chat",
    },
    android: {
      priority: "high",
      notification: {
        sound: "default",
        priority: "high",
        channelId: "high_importance_channel",
        clickAction: "FLUTTER_NOTIFICATION_CLICK",
        visibility: "public",
        importance: "high",
        icon: "@mipmap/ic_launcher",
        color: "#1ab394",
      },
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
          badge: 1,
          contentAvailable: true,
          mutableContent: true,
          category: "MESSAGE_CATEGORY",
        },
      },
      headers: {
        "apns-priority": "10",
        "apns-push-type": "alert",
      },
    },
    webpush: {
      headers: {
        Urgency: "high",
      },
      notification: {
        requireInteraction: true,
        icon: "/icon.png",
        badge: "/badge.png",
        vibrate: [100, 50, 100],
      },
    },
  }));

  try {
    const response = await admin.messaging().sendEach(messages);
    response.responses.forEach((resp, index) => {
      if (resp.success) {
        console.log(`✅ Successfully sent to ${fcmTokens[index]}`);
      } else {
        console.error(`❌ Failed for ${fcmTokens[index]}:`, resp.error);
        if (
          resp.error.code === "messaging/registration-token-not-registered"
        ) {
          console.warn(`⚠️ Token no longer valid: ${fcmTokens[index]}`);
        }
      }
    });
  } catch (error) {
    console.error("🔥 Error sending batch notifications:", error);
  }
};


// Removed `sendNotification()` call without arguments

module.exports = { sendNotification };
