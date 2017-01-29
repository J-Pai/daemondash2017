import urllib2
import json

content = urllib2.urlopen("http://api.umd.io/v0/courses/list").read()
j = json.loads(content)
courses = {}

for course in j:
	 url = "http://api.umd.io/v0/courses/" + course['course_id']
	 res = urllib2.urlopen(url).read()
	 res = json.loads(res)
	 for section in res['sections']:
		  url = "http://api.umd.io/v0/courses/sections/" + section
		  res2 = urllib2.urlopen(url).read()
		  res2 = json.loads(res2)
		  for meeting in res2['meetings']:
				if section in courses:
					 courses[section].append({
						  "days" : meeting['days'],
						  "start_time" : meeting['start_time'],
						  "end_time" : meeting['end_time'],
						  "building" : meeting['building'],
						  "room" : meeting['room']
					 })
				else:
					 courses[section] = [{
						  "days" : meeting['days'],
						  "start_time" : meeting['start_time'],
						  "end_time" : meeting['end_time'],
						  "building" : meeting['building'],
						  "room" : meeting['room']
					 }]
target = open("courses.json", 'w')
courses = json.dumps(courses)
target.write(courses)
