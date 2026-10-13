#!/usr/bin/env python3
"""Genera dist/index.html: la página completa en UN solo archivo
(CSS, JS e imágenes incrustadas). Útil para subirla a cualquier hosting.

Uso:  python3 scripts/build-single.py            -> dist/index.html
      python3 scripts/build-single.py --fragment  -> dist/fragment.html (sin <head>)
"""
import base64, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MIME = {"webp": "image/webp", "jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "svg": "image/svg+xml"}


def read(path):
    with open(os.path.join(ROOT, path), encoding="utf-8") as f:
        return f.read()


def inline_images(text):
    def repl(m):
        path = m.group(0)
        full = os.path.join(ROOT, path)
        if not os.path.exists(full):
            return path  # foto todavía no subida: queda la ruta y se usa el fallback
        ext = path.rsplit(".", 1)[1].lower()
        with open(full, "rb") as f:
            return "data:%s;base64,%s" % (MIME[ext], base64.b64encode(f.read()).decode())
    return re.sub(r"assets/img/[\w/.-]+\.(?:webp|jpe?g|png|svg)", repl, text)


def main():
    fragment = "--fragment" in sys.argv
    html = read("index.html")
    html = html.replace('<link rel="stylesheet" href="assets/css/styles.css">', "<style>\n" + read("assets/css/styles.css") + "\n</style>")
    html = html.replace('<script src="assets/js/data.js"></script>', "<script>\n" + read("assets/js/data.js") + "\n</script>")
    html = html.replace('<script src="assets/js/main.js"></script>', "<script>\n" + read("assets/js/main.js") + "\n</script>")
    html = re.sub(r'\s*<link rel="preload"[^>]*>', "", html)
    # og:image necesita una URL real, no data:
    og = re.search(r'<meta property="og:image" content="([^"]+)">', html)
    html = inline_images(html)
    if og:
        html = re.sub(r'<meta property="og:image" content="[^"]+">', '<meta property="og:image" content="%s">' % og.group(1), html)

    if fragment:
        head = html[html.index("<head>") + 6: html.index("</head>")]
        keep = "\n".join(re.findall(r'<title>.*?</title>|<meta name="description"[^>]*>|<link rel="preconnect"[^>]*>|<link href="https://fonts[^>]*>|<style>.*?</style>', head, re.S))
        body = html[html.index("<body>") + 6: html.index("</body>")]
        html = keep + "\n" + body
        out = "dist/fragment.html"
    else:
        out = "dist/index.html"
    os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
    with open(os.path.join(ROOT, out), "w", encoding="utf-8") as f:
        f.write(html)
    print("%s  %d KB" % (out, len(html) // 1024))


if __name__ == "__main__":
    main()
