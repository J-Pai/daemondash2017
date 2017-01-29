import urllib2
import json

content = urllib2.urlopen("http://api.umd.io/v0/map/buildings").read()
j = json.loads(content)
buildings = {}
for building in j:
	if building['code'] and building['name']:
		buildings[building['name']] = {
			"name" : building['name'],
			"code" : building['code'],
		}
target = open("buildings.json", 'w')
buildings = json.dumps(buildings)
target.write(buildings)
