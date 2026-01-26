// Comprehensive data for phatdo.com portfolio

export const meData = {
    education: [
        { title: "cựu học sinh", place: "thpt nk tân tạo", period: "2013 - 2016", description: "nơi ươm mầm những đam mê đầu đời." },
        { title: "cử nhân", place: "đại học fpt", period: "2016 - 2020", description: "chuyên ngành thiết kế đồ họa. tham gia tích cực vào các hoạt động phong trào và clb." }
    ],
    experience: [
        { title: "graphic designer", place: "freelance", period: "2018 - nay", description: "thiết kế nhận diện thương hiệu, ấn phẩm truyền thông và ui/ux." },
        { title: "creative executive", place: "cocsaigon agency", period: "2020 - 2022", description: "lên ý tưởng, thực hiện các dự án sáng tạo và quản lý đội ngũ thiết kế." }
    ],
    awards: [
        { title: "giải nhất thiết kế đồ họa", place: "fpt university", period: "2019", description: "vinh danh đồ án xuất sắc nhất học kỳ." },
        { title: "top 10 creative staff", place: "cocsaigon agency", period: "2021", description: "đóng góp tích cực cho các chiến dịch truyền thông lớn." }
    ],
    travel: {
        countries: ['Vietnam', 'Thailand', 'Singapore'],
        provinces: [
            'Hồ Chí Minh', 'Hà Nội', 'Đà Lạt', 'Đà Nẵng', 'Phú Quốc',
            'Cần Thơ', 'Đồng Tháp', 'Tiền Giang', 'Bến Tre', 'Vĩnh Long'
        ]
    }
};

export const projects = [
    {
        id: 1,
        title: 'brand identity 2024',
        logo: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=200&auto=format&fit=crop',
        category: 'branding',
        description: 'minimalist branding for a coffee shop in saigon. focusing on the "chill" vibe and community engagement.',
        websiteUrl: 'https://example.com',
        videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
        otherLinks: [
            { name: 'behance case study', url: 'https://behance.net' },
            { name: 'design assets', url: 'https://figma.com' }
        ],
        images: [
            'https://images.unsplash.com/photo-1509319117193-42d138132796?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop'
        ]
    },
    {
        id: 2,
        title: 'ui/ux mobile app',
        logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=200&auto=format&fit=crop',
        category: 'product design',
        description: 'fintech application design focusing on user experience and accessibility in modern banking.',
        websiteUrl: 'https://example.com/app',
        videoUrl: '',
        otherLinks: [
            { name: 'app store', url: 'https://apple.com/app-store' }
        ],
        images: [
            'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop'
        ]
    }
];

export const photos = [
    { id: 1, title: 'saigon nights poster', type: 'poster', image: 'https://images.unsplash.com/photo-1559592413-7cec430aa34f?q=80&w=800&auto=format&fit=crop' },
    { id: 2, title: 'summer collection kv', type: 'key visual', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop' },
    { id: 3, title: 'indie music fest flyer', type: 'ấn phẩm', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop' }
];

export const clips = [
    {
        id: 1,
        title: 'showreel 2023',
        role: 'creative director / editor',
        description: 'a compilation of my best video projects throughout 2023.',
        videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
        otherLinks: [{ name: 'production notes', url: '#' }]
    },
    {
        id: 2,
        title: 'brand film: the wanderer',
        role: 'director of photography',
        description: 'a visual journey exploring the hidden corners of vietnam.',
        videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
        otherLinks: [{ name: 'vimeo', url: '#' }]
    }
];

export const crew = [
    {
        id: 1,
        organization: 'creative team saigon',
        role: 'co-founder / lead designer',
        description: 'a community of young creators focusing on urban culture and high-quality design.',
        otherLinks: [{ name: 'facebook group', url: 'https://facebook.com' }],
        images: [
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop'
        ]
    },
    {
        id: 2,
        organization: 'fpt media clb',
        role: 'media lead',
        description: 'managed all media production for major university events.',
        otherLinks: [{ name: 'portfolio', url: '#' }],
        images: [
            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop'
        ]
    }
];
