"""Read Pages status only. Never create or modify a Pages site."""
import json
import os
from urllib.error import HTTPError
from urllib.request import Request, urlopen


def is_enabled(fetch):
    try:
        return fetch().get('build_type') == 'workflow'
    except HTTPError as error:
        if error.code == 404:
            return False
        raise


def github_pages():
    request = Request(f"https://api.github.com/repos/{os.environ['GITHUB_REPOSITORY']}/pages",
                      headers={'Authorization': f"Bearer {os.environ['GH_TOKEN']}",
                               'Accept': 'application/vnd.github+json', 'User-Agent': 'Stories-Beyond-Hyrule'})
    with urlopen(request, timeout=30) as response:
        return json.load(response)


if __name__ == '__main__':
    enabled = is_enabled(github_pages)
    with open(os.environ['GITHUB_OUTPUT'], 'a', encoding='utf-8') as output:
        output.write(f"enabled={str(enabled).lower()}\n")
    print('Pages is ready for deployment.' if enabled else 'Pages publishing is disabled; build only.')
