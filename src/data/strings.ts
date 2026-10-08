/* Interface strings shared across components: tabs and Pod lines.
   Smaller labels are written inline with t() where they are used. */

import type { TabId } from './profile'
import { translator, type T } from './lang'

export interface TabDef {
  id: TabId
  label: string
  sub: string
  desc: string
  pod: string
}

export function buildStrings(t: T) {
  const tabs: TabDef[] = [
    {
      id: 'home',
      label: t('ACCUEIL', 'HOME'),
      sub: t('Unité', 'Unit'),
      desc: t('Vue d’ensemble : qui je suis, ce que je fais en ce moment, ce que j’aime.', 'Overview: who I am, what I’m doing right now, what I love.'),
      pod: t('Bienvenue. Cette unité s’appelle Louis. Recommandation : explorer chaque case.', 'Welcome. This unit is called Louis. Recommendation: explore every box.'),
    },
    {
      id: 'profile',
      label: t('PROFIL', 'PROFILE'),
      sub: t('Système', 'System'),
      desc: t('Qui je suis, mes 3 compétences clés, soft skills, bilan, contact et réglages.', 'Who I am, my 3 key competences, soft skills, self-assessment, contact and settings.'),
      pod: t('Profil de l’unité. Canal de contact disponible.', 'Unit profile. Contact channel available.'),
    },
    {
      id: 'path',
      label: t('PARCOURS', 'PATH'),
      sub: t('Carte', 'Map'),
      desc: t('Scolarité, diplômes et langues.', 'Schooling, diplomas and languages.'),
      pod: t('Carte chargée. Position actuelle : EPITA Toulouse, 2e année.', 'Map loaded. Current position: EPITA Toulouse, 2nd year.'),
    },
    {
      id: 'projects',
      label: t('PROJETS', 'PROJECTS'),
      sub: t('Archives', 'Archives'),
      desc: t('Projets réalisés, langages et outils, reliés à leurs preuves.', 'Projects, languages and tools, linked to their proofs.'),
      pod: t('Archives des projets. Chaque compétence renvoie à une preuve.', 'Project archives. Every skill points to a proof.'),
    },
    {
      id: 'music',
      label: t('MUSIQUE', 'MUSIC'),
      sub: t('Conservatoire', 'Conservatoire'),
      desc: t('14 ans de conservatoire, instruments, diplômes et scène.', '14 years of conservatoire, instruments, diplomas and stage.'),
      pod: t('Proposition : activer l’ambiance sonore en haut à droite.', 'Proposal: turn on the ambient sound, top right.'),
    },
    {
      id: 'commitments',
      label: t('ENGAGEMENTS', 'COMMITMENTS'),
      sub: t('Quêtes', 'Quests'),
      desc: t('Responsabilités, stage, emplois, éloquence, théâtre et concours.', 'Responsibilities, internship, jobs, public speaking, theatre and contests.'),
      pod: t('Quêtes accomplies. Récompenses : compétences.', 'Quests completed. Rewards: skills.'),
    },
    {
      id: 'life',
      label: t('VIE PERSO', 'LIFE'),
      sub: t('Hors service', 'Off duty'),
      desc: t('Sport, passions et photos.', 'Sport, passions and photos.'),
      pod: t('Données personnelles. L’unité a aussi une vie en dehors de l’écran.', 'Personal data. This unit has a life away from the screen too.'),
    },
  ]

  const pod = {
    name: 'POD 042',
    idle: [
      t('Suggestion : appuyer sur [ ² ] ouvre un terminal. Des archives y sont chiffrées.', 'Hint: pressing [ ` ] opens a terminal. Some archives in there are encrypted.'),
      t('Rapport : aucune anomalie détectée. Tout va bien.', 'Report: no anomaly detected. All is well.'),
      t('Proposition : faire une pause. Le menu attendra.', 'Proposal: take a break. The menu will wait.'),
      t('Observation : vous lisez attentivement. L’unité Louis apprécie.', 'Observation: you are reading carefully. Unit Louis appreciates it.'),
      t('Rappel : le site existe aussi en français / anglais. Bouton en haut à droite.', 'Reminder: the site also exists in French / English. Button at the top right.'),
      t('Requête : pour toute question, utiliser le canal de contact.', 'Request: for any question, use the contact channel.'),
    ],
    breach: t('Déchiffrement en cours. Accès accordé.', 'Decrypting. Access granted.'),
    ambientOn: t('Ambiance sonore activée. Volume : discret.', 'Ambient sound on. Volume: discreet.'),
    ambientOff: t('Ambiance sonore coupée. Silence.', 'Ambient sound off. Silence.'),
    lang: t('Langue : français. Pod 042 s’adapte.', 'Language: English. Pod 042 adapts.'),
    hello: t('Pod 042, en ligne. Je commente votre visite. Cliquez sur moi pour me faire taire.', 'Pod 042, online. I will comment on your visit. Click me to make me quiet.'),
    muted: t('Mise en veille. Cliquez pour me réactiver.', 'Standby. Click to wake me up.'),
  }

  return { tabs, pod }
}

export type Strings = ReturnType<typeof buildStrings>

export const STRINGS: Record<'fr' | 'en', Strings> = {
  fr: buildStrings(translator('fr')),
  en: buildStrings(translator('en')),
}
