"""Import the public-domain IPIP facet item keys, preserving wording and polarity."""
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
data = {}
for size in (120, 300):
    soup = BeautifulSoup(Path(f'/tmp/ipip-key{size}.html').read_text(encoding='cp1252'), 'html.parser')
    facets = []
    current = None
    reverse = False
    for row in soup.find_all('tr'):
        cells = row.find_all('td', recursive=False)
        if not cells:
            continue
        first = cells[0].get_text(' ', strip=True)
        heading = re.match(r'^([NEOAC][1-6]):\s*([^(.]+)', first)
        if heading:
            current = {'id': heading[1], 'name': heading[2].strip().title(), 'items': []}
            facets.append(current)
            reverse = False
            continue
        if current and len(cells) == 2:
            label = cells[0].get_text(' ', strip=True)
            statement = cells[1].get_text(' ', strip=True)
            if 'keyed' in label:
                reverse = '+' not in label
            if statement and statement != '\xa0':
                current['items'].append({'text': statement, 'reverse': reverse})
        if len(facets) == 30 and len(facets[-1]['items']) == size // 30:
            break
    assert len(facets) == 30, (size, len(facets))
    assert all(len(f['items']) == size // 30 for f in facets), [(f['id'], len(f['items'])) for f in facets]
    data[str(size)] = facets
(root / 'src/items.json').write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
print({size: sum(len(f['items']) for f in facets) for size, facets in data.items()})
