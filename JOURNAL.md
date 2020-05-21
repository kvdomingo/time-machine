# Project Journal

`19 May 2020`

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
- Support for 100+ users
- Project journal (this)
- Own flair/features

Right off the bat, I could implement the following on the usual Django-React-MDBootstrap-PostgreSQL stack:

#### Backend
- CRUD API
- Authentication system so you can only access your own check-ins
    - We can program this on the database level to make things simpler
- Postgres database (free tier, easily scalable)
- Django running on Gunicorn deployed to Heroku (also easily scalable if you throw some money at it)


#### Frontend
- I don't think we'll need too many pages, a SPA will do
- Will decide later how to do the visualizations, but what I have in mind right now are Plotly.js, CoreUI, or Chart.js


### Tasks:
- I'll first implement the base CRUD API and wrap the authentication around it later.

### Completed:
- Backend API
- Authentication with JWT

---

`20 May 2020`

### Backend
- Put all frontend-communicating endpoints behind `/api/auth`
- `User` model schema:
```json
{
    "id": "IntegerField",
    "token": "HashField",
    "username": "CharField(255)",
    "email": "EmailField",
    "password": "PasswordField",
    "first_name": "CharField(64)",
    "last_name": "CharField(255)"
}
```
- `CheckIn` model schema:
```json
{
    "id": "IntegerField",
    "author": "ForeignKey(User)",
    "created": "DateTimeField",
    "modified": "DateTimeField",
    "duration": "FloatField",
    "tag": "CharField(64)",
    "activities": "CharField(255)"
}
```


### Frontend (bulk of today's work)
- I'm still going with the SPA so we don't have to worry about additional routing and per-view `meta` tags.
- In the interest of time, I'll group the entries only by day.
- All inputs go into a user-friendly form, but the display is still in the format shown above.
- Time spent per tag must be visualized; I think a pie chart is most appropriate. I'm settling with Chart.js and I'll work on grouping the visualization by day, week, month, and all-time.

#### Additional stuff, in case of extra time
- Logo/branding
- Infinite scroll
- Selenium tests
- Ability to add starting/ongoing tasks
