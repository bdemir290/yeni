import SwiftUI
import WebKit
import UIKit

/// Key under which the game's JSON save is stored in UserDefaults.
private let saveKey = "dortnala_save_v1"

/// Turns any Swift string into a safe JavaScript string literal.
private func jsStringLiteral(_ value: String) -> String {
    guard let data = try? JSONSerialization.data(withJSONObject: [value], options: []),
          let json = String(data: data, encoding: .utf8) else { return "\"\"" }
    return String(json.dropFirst().dropLast()) // ["..."] -> "..."
}

/// Hosts the pixel-art game (index.html in the app bundle) full screen.
struct GameView: UIViewRepresentable {
    func makeCoordinator() -> GameBridge { GameBridge() }

    func makeUIView(context: Context) -> WKWebView {
        let contentController = WKUserContentController()
        contentController.add(context.coordinator, name: "haptic")
        contentController.add(context.coordinator, name: "save")

        // Give the game its saved progress before any of its scripts run.
        let saved = UserDefaults.standard.string(forKey: saveKey) ?? ""
        let boot = WKUserScript(
            source: "window.__NATIVE__ = true; window.__NATIVE_SAVE__ = \(jsStringLiteral(saved));",
            injectionTime: .atDocumentStart,
            forMainFrameOnly: true
        )
        contentController.addUserScript(boot)

        let config = WKWebViewConfiguration()
        config.userContentController = contentController
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []

        let background = UIColor(red: 0.094, green: 0.078, blue: 0.145, alpha: 1)
        let webView = WKWebView(frame: .zero, configuration: config)
        webView.isOpaque = false
        webView.backgroundColor = background
        webView.scrollView.backgroundColor = background
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.scrollView.pinchGestureRecognizer?.isEnabled = false
        webView.allowsLinkPreview = false
        if #available(iOS 16.4, *) {
            webView.isInspectable = true // Safari > Develop menu can attach for debugging
        }

        if let url = Bundle.main.url(forResource: "index", withExtension: "html") {
            webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        }
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}
}

/// Receives messages from the game: haptic feedback and save data.
@MainActor
final class GameBridge: NSObject, WKScriptMessageHandler {
    private let light = UIImpactFeedbackGenerator(style: .light)
    private let medium = UIImpactFeedbackGenerator(style: .medium)
    private let heavy = UIImpactFeedbackGenerator(style: .heavy)
    private let notify = UINotificationFeedbackGenerator()

    func userContentController(_ userContentController: WKUserContentController,
                               didReceive message: WKScriptMessage) {
        switch message.name {
        case "haptic":
            switch message.body as? String ?? "light" {
            case "medium": medium.impactOccurred()
            case "heavy": heavy.impactOccurred()
            case "success": notify.notificationOccurred(.success)
            case "error": notify.notificationOccurred(.error)
            default: light.impactOccurred()
            }
        case "save":
            if let json = message.body as? String {
                UserDefaults.standard.set(json, forKey: saveKey)
            }
        default:
            break
        }
    }
}
