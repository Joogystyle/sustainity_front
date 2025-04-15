# Sustainity – Sustainability Dashboard 🌱

## 🚀 Setup Instructions

To run the project locally:

```bash
git clone <your-repo-url>
cd <project-folder>
npm install
npm run dev
```
## Challenges I Faced
- I hadn’t been coding or building websites for the past 3 months, so I had to refresh a lot of things I previously knew.

- I had never visualized data in a frontend app before, so working with Chart.js and integrating it was completely new for me.

- Handling dynamic CSV uploads with unknown structure was a big challenge. I needed a flexible and general approach to work with any dataset users might upload.

## My Approach
I started by using AI to help scaffold the initial base, and then I revised and customized each part by myself.

I broke the project down into small, manageable components:

- UploadCSV component
- PieChart component
- Sidebar for filtering and sorting

For data visualization, I came up with a general idea: count the frequency of values in a selected column and display them in a Pie Chart. This works well across different datasets.

I used Next.js with TypeScript, styled with Tailwind and shadcn/ui, and handled CSV parsing using PapaParse.
