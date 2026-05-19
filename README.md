# coding-project-template


====================
======================
=======================
-----
question 1
$ curl -s https://api.github.com/repos/hmartinot13-a11y/expressBookReviews | jq '.parent.full_name'
"ibm-developer-skills-network/expressBookReviews"
-----
question 7
$ curl -X POST https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/register -H "Content-Type: application/json" -d '{"username":"herve","password":"pwd123$"}'
{"message":"User successfully registered. Now you can login"}
------
question 8 failed
$ curl -c cookies.txt -X POST https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/customer/login -H "Content-Type: application/json" -d '{"username":"herve","password":"pwd123$"}'
User successfully logged in with access token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoicHdkMTIzJCIsImlhdCI6MTc3OTEwOTIzNSwiZXhwIjoxNzc5MTQ1MjM1fQ.r4dSPz6ls_F_giDn-9bCw4k4ztImYcFfkzM-c1ofGt0

------
question 9 failed
$ curl -b cookies.txt -X PUT https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/customer/auth/review/2 \
  -H "Content-Type: application/json" \
  -d '{"username":"herve"}'
{"message":"Review sucessfully added for book:2 and username:herve"}
***
TOKEN=$(curl -s -X POST https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"herve","password":"pwd123$"}' | jq -r '.token')

curl -X PUT https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/customer/auth/review/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"username":"herve"}'
***
 
------
question 10 failed
$ curl -b cookies.txt -X DELETE https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/customer/auth/review/2 \
  -H "Content-Type: application/json" \
  -d '{"username":"herve"}'
{"message":"Review successfully deleted for book:2 and username:herve"}


------
question 2
$ curl -X GET https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai -H "Content-Type: application/json"
{
    "1": {
        "author": "Chinua Achebe",
        "title": "Things Fall Apart",
        "reviews": {}
    },
    "2": {
        "author": "Hans Christian Andersen",
        "title": "Fairy tales",
        "reviews": {}
    },
    "3": {
        "author": "Dante Alighieri",
        "title": "The Divine Comedy",
        "reviews": {}
    },
    "4": {
        "author": "Unknown",
        "title": "The Epic Of Gilgamesh",
        "reviews": {}
    },
    "5": {
        "author": "Unknown",
        "title": "The Book Of Job",
        "reviews": {}
    },
    "6": {
        "author": "Unknown",
        "title": "One Thousand and One Nights",
        "reviews": {}
    },
    "7": {
        "author": "Unknown",
        "title": "Njál's Saga",
        "reviews": {}
    },
    "8": {
        "author": "Jane Austen",
        "title": "Pride and Prejudice",
        "reviews": {}
    },
    "9": {
        "author": "Honoré de Balzac",
        "title": "Le Père Goriot",
        "reviews": {}
    },
    "10": {
        "author": "Samuel Beckett",
        "title": "Molloy, Malone Dies, The Unnamable, the trilogy",
        "reviews": {}
    }
}
------
question 3
$ curl -X GET https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/2 -H "Content-Type: application/json"
{
    "author": "Hans Christian Andersen",
    "title": "Fairy tales",
    "reviews": {}
}
------
question 4
$ curl -X GET https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/Dante%20Alighieri -H "Content-Type: application/json"
[
    {
        "author": "Dante Alighieri",
        "title": "The Divine Comedy",
        "reviews": 
         {
             "herve1": 
             [
                "commentaire"
             ]
         }
    }
]
-----
Question 5 failed
$ curl -X GET https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/The%20Divine%20Comedy -H "Content-Type: application/json"
[
    {
        "author": "Dante 
Alighieri",
        "title": "The Divine Comedy",
        "reviews": 
         {
             "herve1": 
             [
                "commentaire"
             ]
         }
    }
]
------
question 6 failed
$ curl -X GET https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/review/2 -H "Content-Type: application/json"
{
    "herve": [
        "comment review added for:2 and herve",
        "comment review added for:2 and herve",
        "comment review added for:2 and herve"
    ]
}
------
question 11
https://github.com/hmartinot13-a11y/expressBookReviews/blob/main/final_project/router/general.js


autre question pour acess a Axios
curl -X GET https://hmartinot13-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/test/1 -H "Content-Type: application/json"
====================
======================
=======================