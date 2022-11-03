# get-latest-tag

#### Produces 2 outputs. Latest and previous output as follows
```
${{ steps.jinos.outputs.latestTag }}
${{ steps.jinos.outputs.previousTag }}
```

#### How to use?


```
- name: NewTag
  id: tag
  uses: JinoArch/get-latest-tag@latest
```

An example to get changelog
```
- name: changelog
  id: changelog
  run: |
    echo "changelog=$(git log "${{ steps.tag.outputs.previousTag }}...${{ steps.tag.outputs.latestTag }}" --pretty=format:"- <http://github.com/rewards-guilds/kensho/commit/%H|%h> - %s\n" | awk '{print}' ORS=' ')" >> $GITHUB_OUTPUT
```