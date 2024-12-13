import { writeFileSync } from 'node:fs';
import Parser from 'rss-parser';

/**
 * README.MD에 작성될 페이지 텍스트
 * @type {string}
 */
let text = `# Hi there 👋

## 공부하고 있어요!✍🏼

## 언어

<p>
  <p>
  <!-- HTML -->
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=HTML5&logoColor=white" />
  <!-- CSS -->
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=CSS3&logoColor=white" />
  <!-- JavaScript -->
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white" /> 
  <!-- TypeScript -->
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white" />
  <!-- React -->
  <img alt="React" src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white" />
</p>

</p>

## 📕 Latest Blog Posts

`;

// rss-parser 생성
const parser = new Parser({
    headers: {
        Accept: 'application/rss+xml, application/xml, text/xml; q=0.1',
    },
});

(async () => {
    // 피드 목록
    const feed = await parser.parseURL('https://mori-appa-coding.tistory.com/rss'); // 본인의 블로그 주소

    // 카테고리별 글 묶음을 저장할 객체
    const categories = {};

    // 모든 글을 순회하며 카테고리별로 정리
    feed.items.forEach((item) => {
        const category = item.categories?.[0] || 'Uncategorized'; // 카테고리가 없으면 'Uncategorized'
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push({
            title: item.title,
            link: item.link,
        });
    });

    // 카테고리별로 HTML 구성
    for (const [category, posts] of Object.entries(categories)) {
        text += `### ${category}\n<ul>`;
        posts.forEach((post) => {
            text += `<li><a href='${post.link}' target='_blank'>${post.title}</a></li>`;
        });
        text += `</ul>\n\n`;
    }

    // README.md 파일 생성
    writeFileSync('README.md', text, 'utf8', (e) => {
        if (e) {
            console.error('파일 작성 중 오류:', e);
        } else {
            console.log('README.md 파일 업데이트 완료');
        }
    });
})();
