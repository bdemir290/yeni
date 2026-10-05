import SwiftUI
import WebKit
import UIKit
import AVFoundation

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
        contentController.add(context.coordinator, name: "audio")

        // Give the game its saved progress before any of its scripts run.
        contentController.addUserScript(GameView.bootScript())
        context.coordinator.contentController = contentController

        let config = WKWebViewConfiguration()
        config.userContentController = contentController
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []

        let background = UIColor(red: 0.094, green: 0.078, blue: 0.145, alpha: 1)
        let webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = context.coordinator
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

    /// Script that hands the latest save to the page before the game boots.
    @MainActor static func bootScript() -> WKUserScript {
        let saved = UserDefaults.standard.string(forKey: saveKey) ?? ""
        return WKUserScript(
            source: "window.__NATIVE__ = true; window.__NATIVE_SAVE__ = \(jsStringLiteral(saved));",
            injectionTime: .atDocumentStart,
            forMainFrameOnly: true
        )
    }
}

/// Receives messages from the game: haptic feedback, save data and the audio mode.
@MainActor
final class GameBridge: NSObject, WKScriptMessageHandler, WKNavigationDelegate {
    weak var contentController: WKUserContentController?
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
        case "audio":
            // "playback" keeps the music on with the silent switch (a rhythm game needs its beat);
            // "ambient" respects the switch. Both still mix with the player's own music.
            let loud = (message.body as? String) == "playback"
            let session = AVAudioSession.sharedInstance()
            try? session.setCategory(loud ? .playback : .ambient, mode: .default, options: [.mixWithOthers])
            try? session.setActive(true)
        default:
            break
        }
    }

    /// iOS may end the web content process under memory pressure: reload with the latest save, not the launch one.
    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        if let controller = contentController {
            controller.removeAllUserScripts()
            controller.addUserScript(GameView.bootScript())
        }
        webView.reload()
    }
}
