export interface GalleryItem {
  id: string;
  image: string;
  title: string;
  description: string;
}

export interface GalleryRow {
  id: string;
  columns: number;
  items: GalleryItem[];
}

export interface GallerySection {
  rows: GalleryRow[];
}

export interface SiteContent {
  artistName: string;
  home: {
    heroImage: string;
  };
  about: {
    image: string;
    text: string;
  };
  selectedWorks: GallerySection;
  publicProjects: GallerySection;
}

function createItem(id: string, image: string, title: string, description: string): GalleryItem {
  return { id, image, title, description };
}

function createRow(id: string, columns: number, items: GalleryItem[]): GalleryRow {
  return { id, columns, items: items.slice(0, columns) };
}

export const defaultContent: SiteContent = {
  artistName: "Anam Siddiqui",
  home: {
    heroImage:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&q=80",
  },
  about: {
    image:
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80",
    text: `Anam Siddiqui is a visual artist whose work explores memory, identity, and the quiet spaces between cultures. Working across painting, collage, and mixed media, she creates layered compositions that invite viewers to linger in the details.

Her practice draws from personal narrative and collective history, weaving together fragments of everyday life with broader questions of belonging. She has exhibited in group and solo shows, and her work is held in private collections internationally.`,
  },
  selectedWorks: {
    rows: [
      createRow("sw-row-1", 4, [
        createItem(
          "sw-1",
          "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80",
          "Interior Garden",
          "Oil and acrylic on canvas, 48 × 36 in, 2024"
        ),
        createItem(
          "sw-2",
          "https://images.unsplash.com/photo-1547891654-e966ed978897?w=400&q=80",
          "Evening Light",
          "Mixed media on paper, 30 × 22 in, 2023"
        ),
        createItem(
          "sw-3",
          "https://images.unsplash.com/photo-1515406539379-6c4f0c4e8b0e?w=500&q=80",
          "Still Life with Vessels",
          "Oil on linen, 24 × 20 in, 2023"
        ),
        createItem(
          "sw-4",
          "https://images.unsplash.com/photo-1499781350181-c7520a4fd934?w=450&q=80",
          "Blue Hour",
          "Acrylic on canvas, 40 × 32 in, 2022"
        ),
      ]),
      createRow("sw-row-2", 2, [
        createItem(
          "sw-5",
          "https://images.unsplash.com/photo-1460661419201-fd41a2058173?w=700&q=80",
          "Garden Study I",
          "Oil on canvas, 60 × 48 in, 2022"
        ),
        createItem(
          "sw-6",
          "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&q=80",
          "Garden Study II",
          "Oil on canvas, 60 × 48 in, 2022"
        ),
      ]),
      createRow("sw-row-3", 3, [
        createItem(
          "sw-7",
          "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&q=80",
          "Window Light",
          "Mixed media, 36 × 24 in, 2021"
        ),
        createItem(
          "sw-8",
          "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&q=80",
          "Domestic Scene",
          "Acrylic on panel, 20 × 16 in, 2021"
        ),
        createItem(
          "sw-9",
          "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&q=80",
          "Composition in Green",
          "Oil on canvas, 30 × 24 in, 2020"
        ),
      ]),
    ],
  },
  publicProjects: {
    rows: [
      createRow("pp-row-1", 3, [
        createItem(
          "pp-1",
          "https://images.unsplash.com/photo-1460661419201-fd41a2058173?w=600&q=80",
          "Community Mural, Downtown Arts Center",
          "Permanent installation, 2024"
        ),
        createItem(
          "pp-2",
          "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80",
          "Public Library Residency",
          "Site-specific works on paper, 2023"
        ),
        createItem(
          "pp-3",
          "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=500&q=80",
          "City Hall Window Series",
          "Temporary installation, 2022"
        ),
      ]),
    ],
  },
};

export function migrateGallerySection(
  section: GallerySection | GalleryItem[]
): GallerySection {
  if (!Array.isArray(section)) {
    return section;
  }

  if (section.length === 0) {
    return { rows: [] };
  }

  const rows: GalleryRow[] = [];
  for (let i = 0; i < section.length; i += 2) {
    const rowItems = section.slice(i, i + 2);
    rows.push({
      id: `row-${i}`,
      columns: rowItems.length,
      items: rowItems,
    });
  }

  return { rows };
}

export function normalizeContent(raw: Record<string, unknown>): SiteContent {
  const content = raw as unknown as SiteContent;
  return {
    ...content,
    selectedWorks: migrateGallerySection(
      content.selectedWorks as GallerySection | GalleryItem[]
    ),
    publicProjects: migrateGallerySection(
      content.publicProjects as GallerySection | GalleryItem[]
    ),
  };
}
