exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('universities').del();
  
  // Inserts seed entries
  await knex('universities').insert([
    {
      id: 1,
      name: 'Tsinghua University',
      english_name: 'Tsinghua University',
      description: 'A leading research university in China, known for its excellence in science, technology, and engineering.',
      about: 'Tsinghua University is one of the most prestigious universities in China and the world. Founded in 1911, it has a long history of academic excellence and innovation.',
      website: 'https://www.tsinghua.edu.cn',
      city_id: 1,
      address: 'Haidian District, Beijing',
      phone: '+86-10-6278-3000',
      email: 'admissions@tsinghua.edu.cn',
      ranking: 1,
      type: 'public',
      is_featured: true,
      is_active: true
    },
    {
      id: 2,
      name: 'Peking University',
      english_name: 'Peking University',
      description: 'One of China\'s most prestigious universities, renowned for its comprehensive academic programs.',
      about: 'Peking University is a comprehensive and national key university. The campus, known as "Yan Yuan" (the garden of Yan), is situated in the Haidian District of Beijing.',
      website: 'https://www.pku.edu.cn',
      city_id: 1,
      address: 'Haidian District, Beijing',
      phone: '+86-10-6275-1000',
      email: 'admissions@pku.edu.cn',
      ranking: 2,
      type: 'public',
      is_featured: true,
      is_active: true
    },
    {
      id: 3,
      name: 'Fudan University',
      english_name: 'Fudan University',
      description: 'A comprehensive research university located in Shanghai.',
      about: 'Fudan University is a comprehensive research university located in Shanghai, China. It is one of the most prestigious and selective universities in China.',
      website: 'https://www.fudan.edu.cn',
      city_id: 2,
      address: 'Yangpu District, Shanghai',
      phone: '+86-21-5566-6668',
      email: 'admissions@fudan.edu.cn',
      ranking: 3,
      type: 'public',
      is_featured: true,
      is_active: true
    },
    {
      id: 4,
      name: 'Shanghai Jiao Tong University',
      english_name: 'Shanghai Jiao Tong University',
      description: 'A comprehensive research university with strong engineering programs.',
      about: 'Shanghai Jiao Tong University is a comprehensive research university in Shanghai, China. It is one of the oldest and most prestigious universities in China.',
      website: 'https://www.sjtu.edu.cn',
      city_id: 2,
      address: 'Minhang District, Shanghai',
      phone: '+86-21-3420-0000',
      email: 'admissions@sjtu.edu.cn',
      ranking: 4,
      type: 'public',
      is_featured: true,
      is_active: true
    },
    {
      id: 5,
      name: 'Zhejiang University',
      english_name: 'Zhejiang University',
      description: 'A comprehensive research university in Hangzhou.',
      about: 'Zhejiang University is a comprehensive research university in Hangzhou, Zhejiang Province, China. It is one of the oldest and most prestigious universities in China.',
      website: 'https://www.zju.edu.cn',
      city_id: 5,
      address: 'Xihu District, Hangzhou',
      phone: '+86-571-8795-1000',
      email: 'admissions@zju.edu.cn',
      ranking: 5,
      type: 'public',
      is_featured: true,
      is_active: true
    },
    {
      id: 6,
      name: 'Nanjing University',
      english_name: 'Nanjing University',
      description: 'A comprehensive research university in Nanjing.',
      about: 'Nanjing University is a comprehensive research university in Nanjing, Jiangsu Province, China. It is one of the oldest and most prestigious universities in China.',
      website: 'https://www.nju.edu.cn',
      city_id: 6,
      address: 'Gulou District, Nanjing',
      phone: '+86-25-8968-0000',
      email: 'admissions@nju.edu.cn',
      ranking: 6,
      type: 'public',
      is_featured: true,
      is_active: true
    }
  ]);
};
