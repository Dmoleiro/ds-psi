import AppKit
import Foundation
import PDFKit

let pdfPath = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : ""
let outDir = CommandLine.arguments.count > 2 ? CommandLine.arguments[2] : ""
let pageNumbers = CommandLine.arguments.dropFirst(3).compactMap { Int($0) }

guard !pdfPath.isEmpty, !outDir.isEmpty, !pageNumbers.isEmpty else {
  fputs("Usage: render_wisc_pages.swift <pdf> <outDir> <1-based page numbers...>\n", stderr)
  exit(1)
}

guard let doc = PDFDocument(url: URL(fileURLWithPath: pdfPath)) else {
  fputs("Failed to open PDF at \(pdfPath)\n", stderr)
  exit(1)
}

try FileManager.default.createDirectory(atPath: outDir, withIntermediateDirectories: true)

for pageNumber in pageNumbers {
  let idx = pageNumber - 1
  guard idx >= 0, idx < doc.pageCount, let page = doc.page(at: idx) else {
    fputs("Missing page \(pageNumber)\n", stderr)
    continue
  }

  let bounds = page.bounds(for: .mediaBox)
  let scale: CGFloat = 3.0
  let size = CGSize(width: bounds.width * scale, height: bounds.height * scale)
  let image = page.thumbnail(of: size, for: .mediaBox)

  guard let tiff = image.tiffRepresentation,
        let rep = NSBitmapImageRep(data: tiff),
        let png = rep.representation(using: .png, properties: [:]) else {
    fputs("Failed to render page \(pageNumber)\n", stderr)
    continue
  }

  let out = "\(outDir)/manual-p\(pageNumber).png"
  try png.write(to: URL(fileURLWithPath: out))
  print("wrote \(out)")
}
