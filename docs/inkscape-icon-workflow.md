# Inkscape SVG Icon Workflow

Steps for replacing the custom admonition icons (definition, proposition, lemma, theorem, proof) with new Inkscape text exports.

## 1. Design in Inkscape

- Each icon lives in its own layer (Def, Prp, Lem, Thm, Prf).
- Use the batch export feature to export each layer as a separate SVG into a folder (e.g. `~/Downloads/icons/`).
- The icons are black — colour is applied entirely by CSS, so don't worry about colour in Inkscape.

## 2. Convert text to paths

For **each** exported SVG file:

1. Open the file in Inkscape.
2. Select the text element (`Edit > Select All` or click it).
3. **Path > Object to Path** (`Shift+Ctrl+C`) — converts font glyphs to bezier curves.
4. **File > Save As > Plain SVG** (not Inkscape SVG) — strips Inkscape/Sodipodi metadata.
5. Overwrite the existing file.

After this step each SVG should contain a `<path d="...">` element instead of a `<text>` element, with no font dependency.

> **Why?** The CSS `mask-image` approach embeds the SVG as a data URI. Fonts are not available in that context, so text elements render as nothing or a fallback. Path curves are self-contained.

## 3. Run the conversion script

From any directory, run:

```bash
python3 - <<'PYEOF'
import xml.etree.ElementTree as ET

# Edit these paths to match your export folder and filenames
files = {
    'definition': '/Users/jbaker1/Downloads/icons/Prop_Def.svg',
    'proposition': '/Users/jbaker1/Downloads/icons/Prop_Prp.svg',
    'lemma':       '/Users/jbaker1/Downloads/icons/Prop_Lem.svg',
    'theorem':     '/Users/jbaker1/Downloads/icons/Prop_Thm.svg',
    'proof':       '/Users/jbaker1/Downloads/icons/Prop_Prf.svg',
}

ns = 'http://www.w3.org/2000/svg'

for name, fpath in files.items():
    tree = ET.parse(fpath)
    root = tree.getroot()
    vb = root.get('viewBox')
    g = root.find(f'{{{ns}}}g')
    transform = g.get('transform', '')
    p = g.find(f'{{{ns}}}path')
    d = p.get('d')
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}"><g transform="{transform}"><path d="{d}"/></g></svg>'
    print(f"  --md-admonition-icon--{name}: url('data:image/svg+xml;charset=utf-8,{svg}');")
PYEOF
```

This prints the five CSS variable lines.

## 4. Update extra.css

In `docs/stylesheets/extra.css`, find the `:root { ... }` block that contains the five `--md-admonition-icon--*` variables and replace all five lines with the output from step 3.

The block looks like:

```css
:root {
  --md-admonition-icon--definition: url('...');
  --md-admonition-icon--proposition: url('...');
  --md-admonition-icon--lemma: url('...');
  --md-admonition-icon--theorem: url('...');
  --md-admonition-icon--proof: url('...');
}
```

Or ask Claude to do it — paste the five lines and say "replace the icon variables in extra.css".

## 5. Preview

```bash
uv run mkdocs serve --livereload
```

Check that the icons appear correctly in the admonition headers. The icon colour comes from the `background-color` already set in `extra.css` — no changes needed there.

## Notes

- **Aspect ratio**: Inkscape crops the export to the text bounding box, so wide text (e.g. "Def") produces a wider viewBox than tall text (e.g. "Prf"). The icon slot in the admonition header is square, so the icon will be stretched slightly. To control this, add equal padding around the text in Inkscape before exporting (resize the page/canvas to a consistent square or ratio).
- **Quoting**: The data URI uses single quotes for the outer `url('...')` and double quotes for SVG attributes. Do not swap these — the browser will misparse the CSS.
- **No fill needed**: The path fill defaults to black in SVG. CSS `mask-image` treats black as opaque (colour shows through) and transparent as hidden. Do not set `fill="white"` or remove the fill.
