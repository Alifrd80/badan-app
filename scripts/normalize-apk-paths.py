"""Normalize Windows aapt2 asset separators before alignment and signing."""
import pathlib
import sys
import zipfile

apk = pathlib.Path(sys.argv[1])
normalized = apk.with_suffix('.normalized.apk')
seen = set()
with zipfile.ZipFile(apk) as source, zipfile.ZipFile(normalized, 'w') as target:
    for info in source.infolist():
        # Python normalizes filename on Windows; orig_filename exposes the raw name.
        name = info.orig_filename.replace('\\', '/')
        if name in seen:
            raise ValueError(f'Duplicate APK entry: {name}')
        seen.add(name)
        data = source.read(info)
        info.filename = info.orig_filename = name
        target.writestr(info, data)
normalized.replace(apk)
with zipfile.ZipFile(apk) as check:
    assert all('\\' not in i.orig_filename for i in check.infolist())
    assert 'assets/web/index.html' in check.namelist()
print('APK entry paths normalized and verified.')
