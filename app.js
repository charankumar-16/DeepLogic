const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


app.get('/getTimeStories', async (req, res) => {
    try {
        const response = await axios.get('https://time.com');
        const html = response.data;
        const jsQuery = cheerio.load(html);
        const stories = [];               
         jsQuery('.latest-stories__item').each((index, element) => {
            if (index < 6) {
                const title = jsQuery(element).find('.latest-stories__item-headline').text().trim();
                const ref = jsQuery(element).find('a').attr('href');
                const link = `https://time.com${ref}`;
                stories.push({ title, link });
            }
        });

        res.json(stories);
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({ error: 'Failed to fetch stories' });
    }
});


