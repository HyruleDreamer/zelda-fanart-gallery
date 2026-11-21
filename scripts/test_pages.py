import importlib.util
from pathlib import Path
import unittest
from urllib.error import HTTPError

spec = importlib.util.spec_from_file_location('check_pages', Path(__file__).with_name('check-pages.py'))
pages = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pages)


class PagesSafeguardTests(unittest.TestCase):
    def test_only_existing_actions_pages_can_publish(self):
        self.assertTrue(pages.is_enabled(lambda: {'build_type': 'workflow'}))
        self.assertFalse(pages.is_enabled(lambda: {'build_type': 'legacy'}))
        self.assertFalse(pages.is_enabled(lambda: {}))

    def test_disabled_pages_skips_and_other_errors_fail_closed(self):
        def missing():
            raise HTTPError('https://api.github.com', 404, 'Not Found', {}, None)
        def forbidden():
            raise HTTPError('https://api.github.com', 403, 'Forbidden', {}, None)
        self.assertFalse(pages.is_enabled(missing))
        with self.assertRaises(HTTPError):
            pages.is_enabled(forbidden)
