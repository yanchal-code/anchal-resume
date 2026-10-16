export interface Preset {
  id: string;
  label: string;
  role: string;
  companyHint: string;
  resume: string;
  jobDescription: string;
}

export const PRESETS: Preset[] = [
  {
    id: 'swe-fullstack',
    label: 'Software Engineer',
    role: 'Full Stack Engineer ➔ Senior/Staff Full Stack',
    companyHint: 'Google / Cloud Enterprise',
    resume: `ALEX MORGAN
alex.morgan@email.com | (555) 234-5678 | San Francisco, CA | github.com/alexm-dev | linkedin.com/in/alexm-dev

PROFESSIONAL SUMMARY
Software engineer with 4+ years of experience building web applications. Worked on React frontends, Node backends, and SQL databases. Looking to build scalable cloud software.

WORK EXPERIENCE
Frontend Software Engineer | CloudScale Inc.
2022 - Present | San Francisco, CA
- Worked on web app speed and fixed bugs in React components.
- Helped transition parts of the codebase to TypeScript.
- Participated in weekly agile meetings and sprint planning.
- Built reusable UI buttons, inputs, and modals for the design system.
- Interacted with GraphQL endpoints to fetch customer analytics data.
- Reviewed code written by other developers on the team.

Software Developer | DevWorks Studio
2020 - 2022 | San Jose, CA
- Built web pages for client projects using HTML, CSS, JavaScript, and Node.js.
- Set up MySQL database queries and simple REST API routes.
- Handled basic CI/CD deployments using GitHub Actions.
- Fixed performance issues on customer checkout pages.

SKILLS
- Languages: JavaScript, TypeScript, HTML, CSS, SQL, Python
- Frameworks & Libraries: React, Node.js, Express, Redux, Next.js
- Tools: Git, GitHub Actions, Docker, Webpack, Postman

EDUCATION
B.S. in Computer Science | University of California, Davis (2020)`,
    jobDescription: `Senior Full Stack Software Engineer - Cloud Platform
Google / Tech Infrastructure

About the Role:
We are seeking a Senior Full Stack Software Engineer to build high-scale, resilient enterprise cloud interfaces and distributed microservices. You will collaborate with product designers, systems engineers, and infrastructure architects to deliver mission-critical web applications used by millions of developers worldwide.

Key Responsibilities:
- Architect and develop high-performance, accessible, and reactive frontend experiences using TypeScript, React 19, and Next.js.
- Design scalable backend microservices and GraphQL/REST APIs handling 100,000+ requests per minute with strict p99 latency SLAs.
- Lead performance optimization initiatives across Core Web Vitals (LCP, INP, CLS) and client-side memory footprint.
- Champion engineering excellence through comprehensive unit/integration test coverage (Jest, Playwright) and automated CI/CD pipelines.
- Partner with DevOps to deploy and monitor containerized services on Kubernetes (GKE), Docker, and Google Cloud Platform (GCP).
- Mentor junior engineers and conduct technical design reviews for distributed systems.

Required Qualifications:
- 4+ years of professional full-stack software engineering experience.
- Deep proficiency in modern TypeScript, React, state management, and modern Web Standards.
- Hands-on experience designing robust backend services in Node.js or Go with PostgreSQL/SQL databases.
- Demonstrated experience optimizing web performance and Core Web Vitals.
- Familiarity with Docker, Kubernetes, CI/CD automation, and cloud platforms (GCP or AWS).
- Strong track record of driving cross-functional technical initiatives and code quality standards.`
  },
  {
    id: 'product-manager',
    label: 'Product Manager',
    role: 'Product Manager ➔ Senior Growth & Monetization PM',
    companyHint: 'FinTech / SaaS Platform',
    resume: `JORDAN LEE
jordan.lee@email.com | (555) 345-6789 | New York, NY | linkedin.com/in/jordanlee-pm

SUMMARY
Product Manager with 3+ years managing SaaS features. Experienced in sprint planning, writing user stories, and working with engineering and design teams.

EXPERIENCE
Product Manager | FinEdge Solutions
2022 - Present | New York, NY
- Managed the onboarding product flow for new business users.
- Wrote PRDs, user stories, and acceptance criteria in Jira.
- Ran A/B tests to check how different onboarding steps worked.
- Coordinated with UX designers to update the signup screens.
- Met with customers to get feedback on existing pain points.
- Tracked weekly engagement and active users on dashboards.

Associate Product Manager | VenturePulse
2021 - 2022 | Boston, MA
- Assisted senior product managers with backlog grooming and bug prioritization.
- Pulled simple SQL queries to answer stakeholder questions on user drop-off.
- Created competitor comparison slide decks for quarterly strategy reviews.
- Supported release coordination and wrote release notes for customers.

SKILLS
- Product: User Research, Jira, PRD Writing, Roadmapping, Agile/Scrum
- Analytics: SQL, Google Analytics, Amplitude, Mixpanel, Excel
- Collaboration: Figma, Notion, Slack, Stakeholder Communication

EDUCATION
B.A. in Economics & Information Systems | Boston University (2021)`,
    jobDescription: `Senior Product Manager - Growth & Monetization
FinTech Global

The Opportunity:
We are looking for a data-obsessed Senior Product Manager to own our end-to-end self-serve acquisition, onboarding funnel, and expansion monetization loops. You will drive multi-million dollar ARR growth by experimenting relentlessly across user acquisition, activation, and conversion funnels.

What You'll Do:
- Formulate and execute a data-driven Growth Product Roadmap to accelerate user activation and 30-day retention across self-serve funnels.
- Design, launch, and analyze rigorous high-velocity A/B and multivariate experiments in Amplitude and Optimizely.
- Deep dive into behavioral cohorts, churn curves, and SQL queries to uncover growth bottlenecks and expansion triggers.
- Partner closely with Growth Engineering, Product Marketing, Design, and Data Science to ship fast, iterative improvements.
- Build predictive monetization models and pricing tier experiments to increase Net Revenue Retention (NRR) and Customer Lifetime Value (LTV:CAC).
- Define OKRs, north star growth metrics, and communicate weekly experiment insights to the executive leadership team.

Requirements:
- 3+ years in Product Management with direct ownership of Growth, Activation, or Monetization funnels.
- Expert quantitative toolkit: Fluent in SQL, cohort analysis, statistical significance in A/B testing, and funnel drop-off diagnostics.
- Strong business acumen in B2B SaaS unit economics (CAC, LTV, Payback period, NRR).
- Proven ability to synthesize complex quantitative data and qualitative user interview insights into winning product specs.
- Relentless bias for execution, rapid hypothesis testing, and user-centric problem solving.`
  },
  {
    id: 'data-analytics',
    label: 'Data Analyst',
    role: 'Data Analyst ➔ Lead Analytics Engineer',
    companyHint: 'Modern Cloud Data Stack',
    resume: `TAYLOR REID
taylor.reid@email.com | (555) 456-7890 | Chicago, IL | github.com/treid-data | linkedin.com/in/taylorreid-data

SUMMARY
Data Analyst with 3 years of experience writing SQL queries and building Tableau dashboards for marketing and sales teams.

EXPERIENCE
Data Analyst | RetailMetric
2022 - Present | Chicago, IL
- Wrote SQL queries in PostgreSQL to generate weekly sales reports.
- Created dashboards in Tableau for marketing campaign tracking.
- Answered ad-hoc data requests from the executive team.
- Assisted the data engineering team with moving data between tables.
- Monitored data consistency and reported discrepancies.

Junior Data Analyst | Apex Insights
2021 - 2022 | Chicago, IL
- Cleaned and organized customer datasets using Excel and Python (pandas).
- Documented data definitions and metric calculations in the team wiki.
- Scheduled automated report emails using Python scripts.

SKILLS
- Data & Querying: SQL, PostgreSQL, Python (pandas, numpy), Excel
- BI Tools: Tableau, PowerBI, Looker Studio
- Fundamentals: Data Cleaning, Reporting, Basic Statistics

EDUCATION
B.S. in Statistics | University of Illinois at Urbana-Champaign (2021)`,
    jobDescription: `Analytics Engineer (Modern Data Stack - dbt, Snowflake)
ScaleUp Data Labs

About the Role:
We are seeking an ambitious Analytics Engineer to transform raw event streams into clean, reliable, and version-controlled data models for high-growth operations. You will sit at the intersection of data engineering and business analytics, defining the semantic data layer that powers company-wide decisions.

Key Responsibilities:
- Build and maintain modular, tested, and documented data pipelines using dbt (data build tool) and Snowflake / BigQuery.
- Implement dimensional data modeling (Kimball methodology, star schemas, slowly changing dimensions) to optimize query performance and reporting efficiency.
- Establish automated data quality testing, schema change alerts, and CI/CD pipelines via GitHub Actions and Great Expectations.
- Partner with product managers and finance leaders to define canonical business metric definitions and single sources of truth.
- Optimize complex SQL transformations to reduce data warehouse compute costs and runtime SLAs by 30%+.
- Develop reverse-ETL syncing (Census/Hightouch) to feed clean analytics back into Salesforce, HubSpot, and operational tools.

Qualifications:
- 3+ years experience as a Data Analyst, Analytics Engineer, or BI Developer working with modern cloud data warehouses.
- Advanced SQL proficiency (window functions, CTEs, query plan optimization).
- Hands-on experience with dbt core/cloud, data lineage, and software engineering best practices for data (git, version control, code review).
- Experience with cloud warehouses: Snowflake, BigQuery, or Amazon Redshift.
- Strong communication skills to bridge technical data models with business stakeholder KPIs.`
  }
];
