import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface TurnstileWidgetProps {
  onTokenReceived: (token: string) => void;
  onError?: (error: string) => void;
}

export interface TurnstileWidgetRef {
  reload: () => void;
}

const TURNSTILE_SITE_KEY = process.env.EXPO_PUBLIC_TURNSTILE_SITE_KEY;

const TurnstileWidget = forwardRef<TurnstileWidgetRef, TurnstileWidgetProps>(({ onTokenReceived, onError }, ref) => {
  const webViewRef = useRef<WebView>(null);

  useImperativeHandle(ref, () => ({
    reload: () => {
      webViewRef.current?.reload();
    },
  }));

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            background-color: transparent;
          }
        </style>
      </head>
      <body>
        <div id="turnstile-container"></div>
        <script>
          window.onerror = function(msg, url, line, col, error) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', error: 'JS Error: ' + msg }));
            return false;
          };

          function renderTurnstile() {
            if (typeof turnstile !== 'undefined') {
              turnstile.render('#turnstile-container', {
                sitekey: '${TURNSTILE_SITE_KEY}',
                callback: function(token) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'token', token: token }));
                },
                'error-callback': function(error) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', error: 'Turnstile Error Code: ' + error }));
                },
                theme: 'light',
              });
            } else {
              setTimeout(renderTurnstile, 500);
            }
          }
          
          window.onload = renderTurnstile;
        </script>
      </body>
    </html>
  `;

  const onMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'token') {
        onTokenReceived(data.token);
      } else if (data.type === 'error') {
        onError?.(data.error);
      }
    } catch {
    }
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent, baseUrl: 'https://pishonserv.com' }}
        onMessage={onMessage}
        style={styles.webview}
        scrollEnabled={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        pointerEvents="auto"
        containerStyle={{ backgroundColor: 'transparent' }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          onError?.('WebView Load Error: ' + nativeEvent.description);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          onError?.('HTTP Error: ' + nativeEvent.statusCode);
        }}
      />
    </View>
  );
});

TurnstileWidget.displayName = 'TurnstileWidget';

const styles = StyleSheet.create({
  container: {
    height: 70,
    width: '100%',
    marginVertical: 10,
  },
  webview: {
    backgroundColor: 'transparent',
  },
});

export default TurnstileWidget;
