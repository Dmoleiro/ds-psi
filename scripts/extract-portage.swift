import Foundation
import PDFKit

let url = URL(fileURLPath: CommandLine.arguments[1])
let out = URL(fileURLPath: CommandLine.arguments[2])
guard let doc = PDFDocument(url: url) else {
  fputs("Failed to open PDF\n", stderr)
  exit(1)
}
var parts: [String] = []
for i in 0..<doc.pageCount {
  if let page = doc.page(at: i), let s = page.string {
    parts.append(s)
  }
}
let text = parts.joined(separator: "\n")
try! text.write(to: out, atomically: true, encoding: .utf8)
print("pages=\(doc.pageCount) chars=\(text.count)")
