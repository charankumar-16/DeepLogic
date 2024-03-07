const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/getTimeStories', async (req, res) => {
    try {
        const response = await axios.get('https://time.com');
        const html = await response.data;
        
        const stories = [];
        let startIndex = html.indexOf('<h3 class="latest-stories__item-headline">');
        let endIndex = html.indexOf('</h3>', startIndex);
        
        for (let i = 0; i < 6; i++) {
            const title = extractText(html, startIndex+61, endIndex);
            const linkStartIndex = html.lastIndexOf('href="', startIndex);
            const linkEndIndex = html.indexOf('"', linkStartIndex + 6);
            const ref = html.substring(linkStartIndex + 6, linkEndIndex);
            const link = `https://time.com${ref}`;
            stories.push({ title, link });
            
            startIndex = html.indexOf('<h3 class="latest-stories__item-headline">', endIndex);
            endIndex = html.indexOf('</h3>', startIndex);
        }

        res.json(stories);
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({ error: 'Failed to fetch stories' });
    }
});

function extractText(html, startIndex, endIndex) {
    const startTagIndex = html.lastIndexOf('>', startIndex);
    return html.substring(startTagIndex + 1, endIndex);
}

