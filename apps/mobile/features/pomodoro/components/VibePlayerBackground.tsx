import React, { memo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

interface VibePlayerBackgroundProps {
  videoId: string;
  dimmerOpacity: number;
  videoFit?: "balanced" | "cover" | "contain";
}

function VibePlayerBackgroundComponent({
  videoId,
  dimmerOpacity,
  videoFit = "balanced",
}: VibePlayerBackgroundProps) {
  const { width: winWidth, height: winHeight } = useWindowDimensions();
  const screen = Dimensions.get("screen");
  const [isReady, setIsReady] = useState(false);

  // Full edge-to-edge landscape dimensions (landscape width is max, height is min)
  const screenMax = Math.max(screen.width, screen.height);
  const screenMin = Math.min(screen.width, screen.height);
  const winMax = Math.max(winWidth, winHeight);
  const winMin = Math.min(winWidth, winHeight);

  const safeWidth = Math.max(winMax, screenMax, 100);
  const safeHeight = Math.max(winMin, screenMin, 100);
  const screenRatio = safeWidth / safeHeight;
  const targetRatio = 16 / 9;

  let playerWidth = safeWidth;
  let playerHeight = safeHeight;

  if (videoFit === "cover") {
    // Zoom/Cover mode (fills entire width, crops top & bottom ~18-20%)
    if (screenRatio > targetRatio) {
      playerWidth = safeWidth;
      playerHeight = Math.ceil(safeWidth / targetRatio);
    } else {
      playerHeight = safeHeight;
      playerWidth = Math.ceil(safeHeight * targetRatio);
    }
  } else if (videoFit === "balanced") {
    // Balanced / Smart Zoom mode (50% blend between contain and cover)
    // Makes video significantly larger than contain, while cropping top & bottom by only ~5%
    if (screenRatio > targetRatio) {
      const containWidth = safeHeight * targetRatio;
      playerWidth = Math.round(containWidth + (safeWidth - containWidth) * 0.5);
      playerHeight = Math.round(playerWidth / targetRatio);
    } else {
      const containHeight = safeWidth / targetRatio;
      playerHeight = Math.round(
        containHeight + (safeHeight - containHeight) * 0.5,
      );
      playerWidth = Math.round(playerHeight * targetRatio);
    }
  } else {
    // Strict 16:9 pillarbox (100% video frame visible, black bars on left/right)
    if (screenRatio >= targetRatio) {
      playerHeight = safeHeight;
      playerWidth = Math.round(safeHeight * targetRatio);
    } else {
      playerWidth = safeWidth;
      playerHeight = Math.round(safeWidth / targetRatio);
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.playerWrapper,
          {
            width: playerWidth,
            height: playerHeight,
          },
        ]}
      >
        <YoutubePlayer
          height={playerHeight}
          width={playerWidth}
          videoId={videoId}
          play={true}
          forceAndroidAutoplay={true}
          onReady={() => setIsReady(true)}
          onError={(err: any) => {
            console.warn("YouTube player error:", err);
          }}
          initialPlayerParams={{
            controls: true,
            preventFullScreen: false,
            modestbranding: true,
            rel: false,
          }}
          webViewProps={{
            allowsInlineMediaPlayback: true,
            mediaPlaybackRequiresUserAction: false,
            androidLayerType: "hardware",
          }}
          webViewStyle={styles.webview}
        />
      </View>

      {/* Loading state indicator while YouTube iframe initializes */}
      {!isReady && (
        <View style={styles.loadingContainer} pointerEvents="none">
          <ActivityIndicator size="small" color="#10b981" />
          <Text style={styles.loadingText}>Menyiapkan suasana YouTube...</Text>
        </View>
      )}

      {/* Dimmer Overlay for text contrast (only rendered if opacity > 0) */}
      {dimmerOpacity > 0 && (
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.dimmer,
            { opacity: dimmerOpacity },
          ]}
          pointerEvents="none"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#09090b",
  },
  playerWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  webview: {
    opacity: 0.99, // Prevents Android hardware-accelerated black screen bug
    backgroundColor: "#09090b",
  },
  dimmer: {
    backgroundColor: "#09090b",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: {
    color: "#a1a1aa",
    fontSize: 12,
    fontWeight: "500",
  },
});

export const VibePlayerBackground = memo(VibePlayerBackgroundComponent);
