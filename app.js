const Joi=require('joi');
const express = require('express');
const app = express()

// Den folgenden Teil brauchen wir um in der Funktion zum Posten neuer Kurse
// Ein json Objekt zu parsen
app.use(express.json());


// Alles zum Handeln der Participants
// Open points: Ich habe die Liste Participants genannt.
// Open points: Können wir statt Name, FamilyName nehmem?
// Wollen wir noch ein eine Publich ID generieren? Statt die DB ID zu verwenden.
// Die Verwendung des ClubNamens führt zu einer nicht normalisierten Tabelle. hier sollte in der DB eine Tabelle Clubs gemacht werden.
// Die Verwendung der Bezeichnung der Kathegorie führt zu einer nicht normalisierten Tabelle. Hier sollte in der TB eine Tabelle Cathegories gemacht werden.
const participants =[
    {ParticipantID:1, PreName:'Eva', FamilyName:'Mueller', YearOfBirth:1995, Club:'TVSempach', Cathegory:'Ladies'},
    {ParticipantID:2, PreName:'Daniel', FamilyName:'Hubacher', YearOfBirth:1998, Club:'TVDietwil', Cathegory:'Junioren'},
    {ParticipantID:3, PreName:'Mia' , FamilyName:'Gisler', YearOfBirth:2001, Club:'TVLangenthal', Cathegory:'Kader'},
];

// Abfrage aller Teilnehmer
app.get('/api/participants',(req, res)=>{
    res.send(participants);
});

// Abfrage für die Daten eines spezifischen Teilnehmers über die ParticipantID
app.get('/api/participants/:id',(req, res)=>{
    const Participant=participants.find(c=>c.ParticipantID==parseInt(req.params.id));
    if(!Participant) res.status(404).send('The course with the given ID was not found')// 404
    res.send(Participant);
});

// Die ID wird beim erstellen eines neuen Teilnehmers nicht mitgegeben.
app.post('/api/participants',(req, res)=>{
    const ParticipantSchema=Joi.object()
    .keys({
        PreName: Joi.string()
        .alphanum()
        .min(2)
        .max(30)
        .required(),
        FamilyName: Joi.string()
        .alphanum()
        .min(2)
        .max(30)
        .required(),
        YearOfBirth: Joi.number()
        .integer()
        .min(1900)
        .max(2020)
        .required(),
        Club: Joi.string()
        .required(),
        Cathegory: Joi.string()
        .required(),
    })

    const result = Joi.validate(req.body, ParticipantSchema);
// Das Joi Objekt enthält bereits die Antworten result.error. diese
// Können dann noch weiter erklärt werden. error.details[0].message
    if (result.error){
        res.status(400).send(result.error.details[0].message);
    return    
    }
    const Participant={
        ParticipantId: participants.length+1,
        PreName: req.body.PreName,
        FamilyName: req.body.FamilyName,
        YearOfBirth: req.body.YearOfBirth,
        Club: req.body.Club,
        Cathegory: req.body.Cathegory
    };
    participants.push(Participant);
    res.send(Participant); //Das Zurücksenden des Elements ist konvention.
});



const Rusults=[
    {ResultId:1, ParticipantID:1, DisciplineID: 1, DisciplineResult: 10.6, DisciplineScore: 5},
];



const courses =[
    {id:1, name:'course 1'},
    {id:2, name:'course 2'},
    {id:3, name:'course 3'},
];

app.get('/',(req, res) => res.send('hello world'));


// Allgemeine Abfrage. Zum Beispiel für alle Teilnehmer.
app.get('/api/courses',(req,res)=>{
    res.send(courses);
});

// Element durch Request hinzufügen
// Für nicht String Elemente muss die Joi Doku konsultiert werden.
app.post('/api/courses',(req, res)=>{
    const schema={
        name: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema);
// Das Joi Objekt enthält bereits die Antworten result.error. diese
// Können dann noch weiter erklärt werden. error.details[0].message
    if (result.error){
        res.status(400).send(result.error.details[0].message);
    return
    }
    const course={
        id: courses.length+1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course); //Das Zurücksenden des Elements ist konvention.
});

// Allgemeine Abfrage um einen bestimmten Teilnehmer zu erhalten
// Hier wird const verwendet, da der Wert const nicht mehr verändert werden muss.
// Ansonsten sollte die Variable über let course = definiert werden
// Der Status 404 entspricht der Konvention für API
app.get('/api/courses/:id', (req,res)=>{
    //res.send(req.params.id)
    const course = courses.find(c=>c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course with the given ID was not found');
    res.send(course);
})


app.get('/api/posts/:year/:month',(req,res)=>{
    res.send(req.params);
})

app.listen(4000, ()=>{
    console.log('My REST API running on port 4000!');
})