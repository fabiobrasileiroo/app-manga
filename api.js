const cheerio = require('cheerio');

const formatMangaName = (name) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};


const searchManga = async (userInput) => {
  const formattedInput = formatMangaName(userInput);
  const searchUrl = `https://mangaonline.biz/manga/${formattedInput}/`;
  
  try {
    const response = await fetch(searchUrl);
    if (response.ok) {
      const data = await response.text();
      const $ = cheerio.load(data);
      if ($('.no-result').length === 0) {
        return formattedInput;
      }
    }
  } catch (error) {
    console.error('Error searching manga:', error.message);
  }

  // Se não encontrou, tenta buscar na página de pesquisa
  const searchPageUrl = `https://mangaonline.biz/?s=${encodeURIComponent(userInput)}`;
  try {
    const response = await fetch(searchPageUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch search page');
    }
    const data = await response.text();
    const $ = cheerio.load(data);
    
    if ($('.no-result').length > 0) {
      throw new Error('Manga not found');
    }
    
    // Ajuste este seletor conforme a estrutura da página de resultados de pesquisa
    const mangaLink = $('.listupd .bsx a').first().attr('href');
    
    if (mangaLink) {
      const mangaSlug = mangaLink.split('/').filter(Boolean).pop();
      return mangaSlug;
    }
  } catch (error) {
    console.error('Error searching manga:', error.message);
    throw error;
  }

  throw new Error('Manga not found');
};

const countChapters = async (mangaSlug) => {
  const totalChapterUrl = `https://mangaonline.biz/manga/${mangaSlug}/`;
  try {
    const response = await fetch(totalChapterUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch chapters page');
    }
    const data = await response.text();
    const $ = cheerio.load(data);
    
    const chapters = $('.episodios .episodiotitle a');
    return chapters.length +1;
  } catch (error) {
    console.error('Error while counting chapters:', error.message);
    return 0;
  }
};

const scrapeImages = async (mangaSlug, chapter) => {
  const chapterUrl = `https://mangaonline.biz/capitulo/${mangaSlug}-capitulo-${chapter}/`;
  try {
    const chapterResponse = await fetch(chapterUrl);
    if (!chapterResponse.ok) {
      throw new Error('Failed to fetch chapter page');
    }
    const chapterData = await chapterResponse.text();
    const $chapter = cheerio.load(chapterData);
    const images = [];
    $chapter('.content p img').each((index, img) => {
      const src = $chapter(img).attr('src');
      if (src) {
        images.push(src);
      }
    });
    return images;
  } catch (error) {
    throw new Error('Error while scraping images: ' + error.message);
  }
};

const getAnimeData = async (userInput, chapter) => {
  try {
    const mangaSlug = await searchManga(userInput);
    const chapterCount = await countChapters(mangaSlug);
    console.log(`Number of chapters for ${mangaSlug}: ${chapterCount}`);
    if (parseInt(chapter) > chapterCount) {
      throw new Error(`Chapter ${chapter} exceeds the available chapters.`);
    }
    const images = await scrapeImages(mangaSlug, chapter);
    console.log('Scraped images:', images);
    return { images, chapterCount, mangaSlug };
  } catch (error) {
    console.error(error.message);
    return { images: [], chapterCount: 0, mangaSlug: '' };
  }
};

module.exports = {
  getAnimeData,
  searchManga,
  countChapters
};