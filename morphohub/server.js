const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Mock data
const mockModels = [
    {
        id: 1,
        name: "Tropical Rattlesnake",
        image: "/images/rattlesnake.jpg",
        museum: "INPA",
        location: "Amazonas, Brazil",
        uploadedBy: "Dr. Silva",
        institution: "INPA Herpetology",
        date: "2023-11-20",
        darwinCore: `# Darwin Core Metadata
occurrenceID: "INPA-H-004"
scientificName: "Crotalus durissus"
institutionCode: "INPA"
collectionCode: "Herpetology"
catalogNumber: "INPA-H-004"
basisOfRecord: "PreservedSpecimen"
occurrenceRemarks: "Adult female, ethanol preserved"
recordedBy: "Dr. Carlos Silva"
identifiedBy: "Dr. Maria Oliveira"
dateIdentified: "2023-11-15"
individualCount: 1
sex: "female"
lifeStage: "young"
preparations: "ethanol"
country: "Brazil"
stateProvince: "Amazonas"
locality: "Manaus Ecological Reserve"
decimalLatitude: -3.1000
decimalLongitude: -60.0167
geodeticDatum: "WGS84"
coordinateUncertaintyInMeters: 500
kingdom: "Animalia"
phylum: "Chordata"
class: "Reptilia"
order: "Squamata"
family: "Viperidae"
genus: "Crotalus"
specificEpithet: "durissus"
infraspecificEpithet: "collilineatus"
taxonRank: "subspecies"
scientificNameAuthorship: "Linnaeus, 1758"
verbatimIdentification: "Crotalus durissus collilineatus"
habitat: "Tropical rainforest"
behavior: "Nocturnal"
associatedMedia: "https://morphohub.org/specimens/INPA-H-004"
license: "CC-BY-NC 4.0"`
    },
    {
        id: 2,
        name: "Alcatrazes Lancehead",
        image: "/images/alcatraz.jpg",
        museum: "MZUSP",
        location: "Alcatrazes Island, São Paulo, Brazil",
        uploadedBy: "Dr. Santos",
        institution: "Instituto Butantan",
        date: "2024-01-15",
        darwinCore: `# Darwin Core Metadata
occurrenceID: "MZUSP-H-002"
scientificName: "Bothrops alcatraz"
institutionCode: "MZUSP"
collectionCode: "Herpetology"
catalogNumber: "MZUSP-H-002"
basisOfRecord: "PreservedSpecimen"
occurrenceRemarks: "Adult male, ethanol preserved"
recordedBy: "Dr. Ana Santos"
identifiedBy: "Dr. Paulo Vanzolini"
dateIdentified: "2024-01-10"
individualCount: 1
sex: "male"
lifeStage: "adult"
preparations: "ethanol"
country: "Brazil"
stateProvince: "São Paulo"
locality: "Alcatrazes Island"
decimalLatitude: -24.1000
decimalLongitude: -45.7000
geodeticDatum: "WGS84"
coordinateUncertaintyInMeters: 100
kingdom: "Animalia"
phylum: "Chordata"
class: "Reptilia"
order: "Squamata"
family: "Viperidae"
genus: "Bothrops"
specificEpithet: "alcatraz"
taxonRank: "species"
scientificNameAuthorship: "Marques, Martins & Sazima, 2002"
verbatimIdentification: "Bothrops alcatraz"
habitat: "Island vegetation"
behavior: "Terrestrial"
associatedMedia: "https://morphohub.org/specimens/MZUSP-H-002"
license: "CC-BY-NC 4.0"`
    },
    {
        id: 3,
        name: "Jararaca-Caiçaca",
        image: "/images/moojeni.jpg",
        museum: "MPEG",
        location: "Pará, Brazil",
        uploadedBy: "Dr. Costa",
        institution: "Museu Paraense Emílio Goeldi",
        date: "2024-03-10",
        darwinCore: `# Darwin Core Metadata
occurrenceID: "MPEG-H-003"
scientificName: "Bothrops atrox"
institutionCode: "MPEG"
collectionCode: "Herpetology"
catalogNumber: "MPEG-H-003"
basisOfRecord: "PreservedSpecimen"
occurrenceRemarks: "Sub-adult female, ethanol preserved"
recordedBy: "Dr. Roberto Costa"
identifiedBy: "Dr. Teresa Avila"
dateIdentified: "2024-03-05"
individualCount: 1
sex: "female"
lifeStage: "sub-adult"
preparations: "ethanol"
country: "Brazil"
stateProvince: "Pará"
locality: "Caxiuanã National Forest"
decimalLatitude: -1.7500
decimalLongitude: -51.4500
geodeticDatum: "WGS84"
coordinateUncertaintyInMeters: 300
kingdom: "Animalia"
phylum: "Chordata"
class: "Reptilia"
order: "Squamata"
family: "Viperidae"
genus: "Bothrops"
specificEpithet: "atrox"
taxonRank: "species"
scientificNameAuthorship: "Linnaeus, 1758"
verbatimIdentification: "Bothrops atrox"
habitat: "Amazonian rainforest"
behavior: "Nocturnal, terrestrial"
associatedMedia: "https://morphohub.org/specimens/MPEG-H-003"
license: "CC-BY-NC 4.0"`
    }
];

const mockTomographyLabs = [
    {
        id: 1,
        name: 'USP Imaging Lab',
        location: 'São Paulo, Brazil',
        service: {
            type: 'tomography',
            name: 'Tomography Services',
            price: 120,
            rating: 4.8,
            reviews: 45,
            equipment: 'Phoenix v|tome|x M',
            resolution: 'up to 2.5µm'
        }
    },
    {
        id: 2,
        name: 'UNESP Research Center',
        location: 'Rio Claro, Brazil',
        service: {
            type: 'tomography',
            name: 'Tomography Services',
            price: 100,
            rating: 4.9,
            reviews: 67,
            equipment: 'Zeiss Xradia 510 Versa',
            resolution: 'up to 1.5µm'
        }
    },
    {
        id: 3,
        name: 'UNICAMP Advanced Lab',
        location: 'Campinas, Brazil',
        service: {
            type: 'tomography',
            name: 'Tomography Services',
            price: 150,
            rating: 5.0,
            reviews: 28,
            equipment: 'Bruker SkyScan 1272',
            resolution: 'up to 7µm'
        }
    }
];

const mockTechnicians = [
    {
        id: 1,
        name: 'Dr. Ana Silva',
        title: 'Senior Morphology Analyst',
        institution: 'Instituto Butantan',
        location: 'São Paulo, Brazil',
        specialties: ['Viperidae', 'Elapidae'],
        service: {
            type: 'analysis',
            name: 'Technical Analysis',
            price: 450,
            rating: 4.9,
            reviews: 38,
            experience: '15 years',
            publications: 45
        }
    },
    {
        id: 2,
        name: 'Dr. Roberto Santos',
        title: 'Research Morphologist',
        institution: 'UFRJ',
        location: 'Rio de Janeiro, Brazil',
        specialties: ['Colubridae', 'Dipsadidae'],
        service: {
            type: 'analysis',
            name: 'Technical Analysis',
            price: 380,
            rating: 4.7,
            reviews: 42,
            experience: '12 years',
            publications: 32
        }
    },
    {
        id: 3,
        name: 'Dr. Carla Oliveira',
        title: 'Comparative Morphologist',
        institution: 'UFMG',
        location: 'Belo Horizonte, Brazil',
        specialties: ['All snake families', 'Skull morphology'],
        service: {
            type: 'analysis',
            name: 'Technical Analysis',
            price: 500,
            rating: 5.0,
            reviews: 25,
            experience: '18 years',
            publications: 63
        }
    }
];

// Routes
app.get('/api/models', (req, res) => {
    res.json(mockModels);
});

app.get('/api/tomography-labs', (req, res) => {
    res.json(mockTomographyLabs);
});

app.get('/api/technicians', (req, res) => {
    res.json(mockTechnicians);
});

app.get('/api/models/:id/metadata', (req, res) => {
    const model = mockModels.find(m => m.id === parseInt(req.params.id));
    if (!model) {
        return res.status(404).json({ error: 'Model not found' });
    }
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${model.name.toLowerCase().replace(/\s+/g, '_')}_metadata.txt"`);
    res.send(model.darwinCore);
});

app.post('/api/register', (req, res) => {
    // Mock registration
    res.json({ success: true, message: 'Registration successful' });
});

app.post('/api/login', (req, res) => {
    // Mock login
    res.json({ success: true, message: 'Login successful' });
});

app.post('/api/purchase', (req, res) => {
    // Mock purchase
    res.json({ success: true, message: 'Purchase successful' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
