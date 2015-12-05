# RCOS Stats

Automatically generates statistics using Observatory3 and Github

## Getting the data files

Data files (users.json, projects.json etc.) should be stored in the collections directory.

To generate a collections directory, execute the following command on a server running Observatory.

```javascript
mkdir collections
mongoexport --db observatory3 --collection users --out collections/users.json
mongoexport --db observatory3 --collection projects --out collections/projects.json
mongoexport --db observatory3 --collection classyears --out collections/classyears.json
```


