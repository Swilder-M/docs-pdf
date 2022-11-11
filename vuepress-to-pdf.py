import requests
from pdfkit import from_url


def get_children_url(_d):
    urls = []
    for _path in _d:
        if _path.get('path'):
            urls.append(_path['path'])
            continue

        if _path.get('children'):
            urls.extend(get_children_url(_path['children']))
            continue
    return urls


def get_urls(product, version, lang):
    if product == 'broker':
        json_url = f'https://raw.githubusercontent.com/emqx/emqx-docs/release-{version}/directory.json'
    elif product == 'enterprise':
        json_url = f'https://raw.githubusercontent.com/emqx/emqx-docs/release-{version}/directory_ee.json'
    else:
        print('error product', product)
        return None

    json_data = requests.get(json_url).json()
    json_data = json_data[lang]

    all_path = get_children_url(json_data)
    all_urls = []
    for _path in all_path:
        if lang == 'cn':
            lang = 'zh'
        if _path == './':
            all_urls.append(f'https://docs.emqx.com/{lang}/enterprise/v{version}/')
        else:
            all_urls.append(f'https://docs.emqx.com/{lang}/enterprise/v{version}/{_path}.html')

    return all_urls


def gen_pdf(product, version, lang='cn'):
    url = get_urls(product, version, lang)
    version = version.replace('v', '')
    if version == 'latest':
        version_display = 'latest'
    else:
        version_display = 'V' + version

    if product == 'broker':
        product_display = 'EMQX'
    elif product == 'enterprise':
        product_display = 'EMQX Enterprise'
    else:
        print('error product', product)
        return None

    options = {
        'print-media-type': None,
        'user-style-sheet': 'assets/docs.css',
        'dump-outline': 'assets/toc.xml',
        'enable-local-file-access': None,
        'javascript-delay': 60000,
        'header-center': f'{product_display} {version_display} Docs',
        'header-font-size': 10,
        'header-spacing': 5,
        'footer-center': '[page] / [topage]',
        'footer-font-size': 8,
        'page-offset': -1
        #     'enable-internal-links': None,
        #     'keep-relative-links': None
        #     'dump-default-toc-xsl': None
    }
    toc = {
        'xsl-style-sheet': 'assets/toc.xsl'
    }
    cover = 'https://docs.emqx.com/404.html'

    from_url(url, f'{product}-{version}-{lang}.pdf',
             options=options, verbose=True,
             toc=toc, cover=cover, cover_first=True)


if __name__ == '__main__':
    gen_pdf('enterprise', '4.4', 'cn')
