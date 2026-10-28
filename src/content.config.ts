import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { localized, partialDate, period, positionSchema } from './content/schema';

/*
 * One YAML file per CV section. `file()` is one-collection-per-file, so the
 * file boundary matches the section boundary: the thing you edit is the thing
 * you see on the page.
 *
 * Note: unlike `glob()`, the `file()` loader does NOT generate ids — every
 * entry in these YAML files must carry an explicit `id`.
 */

const education = defineCollection({
  loader: file('src/data/cv/education.yaml'),
  schema: positionSchema,
});

const experience = defineCollection({
  loader: file('src/data/cv/experience.yaml'),
  schema: positionSchema,
});

const internships = defineCollection({
  loader: file('src/data/cv/internships.yaml'),
  schema: positionSchema,
});

const volunteering = defineCollection({
  loader: file('src/data/cv/volunteering.yaml'),
  schema: positionSchema,
});

/** Single-date events, so a `date` rather than a `period`. */
const awards = defineCollection({
  loader: file('src/data/cv/awards.yaml'),
  schema: z.object({
    title: localized(z.string()),
    /** What it was awarded for — the degree, competition or venue. */
    context: localized(z.string()).optional(),
    organisation: z.string().optional(),
    location: z.string().optional(),
    date: partialDate,
    url: z.url().optional(),
    inPdf: z.boolean().default(true),
  }),
});

const skills = defineCollection({
  loader: file('src/data/cv/skills.yaml'),
  schema: z.object({
    label: localized(z.string()),
    /** Tool and language names are proper nouns — not translated. */
    /** Author-defined display order; getCollection() is unordered. */
    order: z.number().int().default(0),
    items: z.array(z.string()).default([]),
    /** For groups that read as a sentence rather than a list. */
    note: localized(z.string()).optional(),
  }),
});

const languages = defineCollection({
  loader: file('src/data/cv/languages.yaml'),
  schema: z.object({
    name: localized(z.string()),
    level: localized(z.string()),
    /** Common European Framework level, where one applies. */
    cefr: z.string().optional(),
    order: z.number().int().default(0),
    /** Drives the filled-dot rendering, 1-5. */
    proficiency: z.number().int().min(1).max(5),
  }),
});

/** Upstream projects contributed to but not led. */
const contributions = defineCollection({
  loader: file('src/data/contributions.yaml'),
  schema: z.object({
    name: z.string(),
    url: z.url(),
    order: z.number().int().default(0),
    role: localized(z.string()),
    summary: localized(z.string()),
  }),
});

/**
 * One file per project. `kind` drives the three sections on the projects page —
 * the distinction between work done for the research post, work led personally
 * in the same field, and older personal work.
 *
 * There is deliberately no organisation/owner field: the GitHub org these live
 * under is shared and not the author's, so it must never surface as an
 * affiliation. Links are always to a specific repository.
 */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.yaml' }),
  schema: z.object({
    name: z.string(),
    kind: z.enum(['research', 'independent', 'personal']),
    status: z.enum(['active', 'in-development', 'archived']).default('active'),
    featured: z.boolean().default(false),
    /** Optional: several repositories have no documented start date, and an
     *  invented one would be worse than none. */
    period: period.optional(),
    summary: localized(z.string()),
    tech: z.array(z.string()).default([]),
    primaryUrl: z.url().optional(),
    /** Sub-projects of an umbrella, e.g. rexlib under REX. */
    components: z
      .array(
        z.object({
          name: z.string(),
          url: z.url(),
          summary: localized(z.string()),
        })
      )
      .default([]),
  }),
});

/** Long-form prose: one Markdown file per language, under a locale folder. */
const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = {
  education,
  experience,
  internships,
  volunteering,
  awards,
  skills,
  languages,
  contributions,
  projects,
  pages,
};
