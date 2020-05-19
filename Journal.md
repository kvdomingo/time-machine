# Project Journal

## `19 May 2020`

### Requirements
In summary, the project explicitly requires the following:
- Input a check-in with the ff. format:
```
<number> [hr|hrs] #<tag> <activities>
```
- Show all check-ins, grouped by day
- Visualize time spent, grouped per tag
- Delete a check-in
- Have an HTML frontend
- Persistent storage
- Code documentation

Bonus tasks:
- App accessible by URL
- Support for 100 users
- Project journal (this)
- Own flair/features

Right off the bat, I could implement the following on the usual Django+React stack:

#### Backend
- CRUD API
- Authentication system so you can only access your own check-ins
    - We can program this on the database level to make things simpler
- Postgres database (free tier, easily scalable)
- Django running on Gunicorn deployed to Heroku (also easily scalable if you throw some money at it)


#### Frontend
- I don't think we'll need too many pages, a SPA will do
- Will decide later how to do the visualizations, but what I have in mind right now are Plotly.js or CoreUI

#### Tests
- Postman for API
- Selenium for UI


### Tasks:
1. I'll first implement the base CRUD API and wrap the authentication around it later.
