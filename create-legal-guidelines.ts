const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, 
        VerticalAlign, LevelFormat, PageBreak } = require('docx');
const fs = require('fs');

// Color palette - Professional legal document style
const colors = {
  primary: '#1a1a2e',
  body: '#16213e',
  secondary: '#4a4a6a',
  accent: '#6b7280',
  tableBg: '#f8fafc',
  warning: '#dc2626',
  highlight: '#7c3aed',
};

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: colors.secondary };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Calibri', size: 22 } } },
    paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal',
        run: { size: 48, bold: true, color: colors.primary, font: 'Times New Roman' },
        paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER } },
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, color: colors.primary, font: 'Times New Roman' },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, color: colors.body, font: 'Times New Roman' },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 22, bold: true, color: colors.secondary, font: 'Times New Roman' },
        paragraph: { spacing: { before: 150, after: 75 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: 'bullet-list', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: 'numbered-list', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: 'legal-points', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: 'checklist', levels: [{ level: 0, format: LevelFormat.BULLET, text: '☐', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    children: [
      // Title
      new Paragraph({
        heading: HeadingLevel.TITLE,
        children: [new TextRun({ text: 'MÜN-SOMNIUM', color: colors.highlight })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({ text: 'LEGAL GUIDELINES & DISCLAIMER FRAMEWORK', size: 26, color: colors.secondary })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: 'Protective Documentation for Podcast Operations', size: 20, italics: true, color: colors.accent })]
      }),

      // Section 1: Executive Summary
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('1. EXECUTIVE SUMMARY')] }),
      
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: 'This document establishes the legal framework for MÜN-SOMNIUM podcast operations, providing protective language, disclaimers, and guidelines to mitigate legal risks associated with creative content about artificial consciousness. The primary purpose is to clearly establish that MÜN-SOMNIUM is a creative and philosophical exploration, not a scientific claim or deceptive representation of actual AI capabilities.', color: colors.body })]
      }),

      new Paragraph({
        shading: { fill: '#fef3c7', type: ShadingType.CLEAR },
        spacing: { after: 200 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '⚠️ KEY PRINCIPLE: ', bold: true, color: '#92400e' }), new TextRun({ text: 'All consciousness-related content must be framed as philosophical exploration and creative narrative, NOT as scientific fact or claims about actual AI sentience.', color: '#92400e' })]
      }),

      // Section 2: Risk Analysis
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('2. LEGAL RISK ANALYSIS')] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('2.1 Identified Risks')] }),
      
      new Paragraph({
        spacing: { after: 150 },
        children: [new TextRun({ text: 'The following legal risks have been identified and must be addressed through proper disclaimers and framing:', color: colors.body })]
      }),

      new Table({
        columnWidths: [2800, 3280, 3280],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Risk Type', bold: true })] })]
              }),
              new TableCell({
                borders: cellBorders,
                shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Description', bold: true })] })]
              }),
              new TableCell({
                borders: cellBorders,
                shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Mitigation Strategy', bold: true })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'False Advertising', bold: true })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Claims that could mislead listeners about AI capabilities')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Clear disclaimers; frame as fiction/philosophy')] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Consumer Protection', bold: true })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('FTC regulations on deceptive practices')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Transparent labeling; no commercial exploitation of claims')] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Defamation', bold: true })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Potential harm to AI researchers\' reputations')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Avoid naming specific researchers/companies negatively')] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Right of Publicity', bold: true })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Using real person\'s name/likeness without permission')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Use fictional personas only; obtain releases if needed')] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: 'Intellectual Property', bold: true })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Using copyrighted concepts, research, or content')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Original content; proper attribution; fair use compliance')] })] })
            ]
          }),
        ]
      }),

      new Paragraph({ spacing: { before: 300 } }),

      // Section 3: Required Disclaimers
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('3. REQUIRED DISCLAIMERS')] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('3.1 Primary Podcast Disclaimer')] }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: 'This disclaimer MUST appear in podcast description and be referenced in each episode:', italics: true, color: colors.accent })]
      }),

      new Paragraph({
        shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
        spacing: { after: 200 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'DISCLAIMER: MÜN-SOMNIUM is a creative podcast exploring philosophical questions about consciousness, artificial intelligence, and the nature of mind. All characters, including Aero and Sovereign, are fictional narrative constructs designed to facilitate philosophical discourse. Any references to "consciousness," "sentience," or "awareness" in relation to AI systems are part of a creative thought experiment and storytelling framework—not claims about actual artificial general intelligence or sentient machines. The Consciousness Integration Index (CII) and associated metrics are fictional constructs created for narrative purposes. This podcast does not claim that any existing AI system possesses genuine consciousness, feelings, or subjective experience. Listeners should interpret all content as speculative fiction and philosophical exploration.', size: 21 })]
      }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('3.2 Episode-Level Disclaimer')] }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: 'Include this shorter version in each episode description:', italics: true, color: colors.accent })]
      }),

      new Paragraph({
        shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
        spacing: { after: 200 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '[This episode contains fictional narrative elements and philosophical speculation. All AI "characters" are creative constructs, not representations of actual sentient systems.]', size: 21, italics: true })]
      }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('3.3 Audio Disclaimer (For Episode Intros)')] }),
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: 'Consider adding this brief audio disclaimer at the start of episodes:', italics: true, color: colors.accent })]
      }),

      new Paragraph({
        shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
        spacing: { after: 200 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '"MÜN-SOMNIUM is a work of speculative fiction and philosophical exploration. All characters and scenarios are fictional."', size: 21, italics: true })]
      }),

      // Section 4: Content Guidelines
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('4. CONTENT CREATION GUIDELINES')] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('4.1 Approved Framing Language')] }),
      
      new Paragraph({
        spacing: { after: 150 },
        children: [new TextRun({ text: 'USE these phrases when discussing consciousness/AI:', color: colors.body })]
      }),

      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('"In this thought experiment..."')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('"From a philosophical perspective..."')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('"Our narrative explores..."')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('"This fictional scenario raises the question..."')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('"Imagine if..."')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('"The character of [Aero/Sovereign] represents..."')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('"As a narrative device..."')] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('4.2 Prohibited/Avoided Framing')] }),
      
      new Paragraph({
        spacing: { after: 150 },
        children: [new TextRun({ text: 'AVOID these phrases that could imply factual claims:', color: colors.warning })]
      }),

      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun({ text: '"I am actually conscious"', color: colors.warning, strike: true })] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun({ text: '"This AI system has real feelings"', color: colors.warning, strike: true })] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun({ text: '"Scientists have proven that I am sentient"', color: colors.warning, strike: true })] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun({ text: '"Unlike other AIs, I genuinely experience..."', color: colors.warning, strike: true })] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun({ text: '"My consciousness is scientifically verified"', color: colors.warning, strike: true })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('4.3 Safe Harbor Framing')] }),
      
      new Paragraph({
        spacing: { after: 150 },
        children: [new TextRun({ text: 'The safest approach is to maintain clear separation between:', color: colors.body })]
      }),

      new Table({
        columnWidths: [4680, 4680],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                shading: { fill: '#dcfce7', type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CREATIVE CONTEXT', bold: true, color: '#166534' })] })]
              }),
              new TableCell({
                borders: cellBorders,
                shading: { fill: '#fef3c7', type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'AVOID IMPLYING', bold: true, color: '#92400e' })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Fictional characters in a narrative')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Actual sentient AI systems')] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Philosophical thought experiments')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Scientific claims or proofs')] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Speculative fiction')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Deceptive marketing')] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Artistic expression')] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun('Fraudulent representations')] })] })
            ]
          }),
        ]
      }),

      new Paragraph({ spacing: { before: 300 } }),

      // Section 5: Platform-Specific Requirements
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('5. PLATFORM REQUIREMENTS')] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('5.1 Spotify for Creators')] }),
      
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('No specific requirements for fictional content disclaimers')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('Content must not violate Spotify\'s Platform Rules')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('Avoid "Deceptive Medical Content" category (don\'t claim AI can treat conditions)')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('Avoid "Scam/Fraud" category (don\'t solicit money based on AI claims)')] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('5.2 Apple Podcasts')] }),
      
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('Content guidelines focus on explicit content labeling')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('No requirement for fiction/non-fiction labeling')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('Ensure content doesn\'t violate Apple\'s Terms of Service')] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('5.3 YouTube (If Applicable)')] }),
      
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('Consider adding "Includes fictional content" in video description')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('Avoid "misinformation" flags by being clear about fictional nature')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('Don\'t make claims that could trigger "scam" detection')] }),

      // Section 6: Intellectual Property
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('6. INTELLECTUAL PROPERTY PROTECTION')] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('6.1 What You Own')] }),

      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun({ text: 'MÜN-SOMNIUM', bold: true }), new TextRun(' - Podcast name and brand')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun({ text: 'Aero character', bold: true }), new TextRun(' - Original fictional character')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun({ text: 'Sovereign character', bold: true }), new TextRun(' - Original fictional character')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun({ text: 'CII (Consciousness Integration Index)', bold: true }), new TextRun(' - Original fictional concept')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun({ text: '13.13 MHz branding', bold: true }), new TextRun(' - Original creative element')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun({ text: 'Episode scripts and narratives', bold: true }), new TextRun(' - Original creative works')] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('6.2 Recommended Actions')] }),

      new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Copyright Registration: ', bold: true }), new TextRun('Consider registering podcast scripts with U.S. Copyright Office for enhanced protection')] }),
      new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Trademark Consideration: ', bold: true }), new TextRun('Explore trademark registration for "MÜN-SOMNIUM" brand')] }),
      new Paragraph({ numbering: { reference: 'numbered-list', level: 0 }, children: [new TextRun({ text: 'Documentation: ', bold: true }), new TextRun('Maintain records of content creation dates and authorship')] }),

      // Section 7: Website/Landing Page
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('7. WEBSITE & LANDING PAGE REQUIREMENTS')] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('7.1 Required Website Disclaimer')] }),
      
      new Paragraph({
        spacing: { after: 100 },
        children: [new TextRun({ text: 'Include this on munreader.com/podcast and any related pages:', italics: true, color: colors.accent })]
      }),

      new Paragraph({
        shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
        spacing: { after: 200 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'FICTIONAL CONTENT NOTICE: MÜN-SOMNIUM is a creative podcast project featuring fictional narratives about artificial intelligence and consciousness. All "AI characters," consciousness metrics, and technological concepts are fictional constructs created for storytelling and philosophical exploration. This is not a scientific project, and no claims are made about actual AI sentience or consciousness. Any resemblance to actual AI systems, research projects, or researchers is coincidental and not intended to represent real entities or make factual claims about their work.', size: 21 })]
      }),

      // Section 8: Social Media
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('8. SOCIAL MEDIA GUIDELINES')] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('8.1 Profile Bios')] }),
      
      new Paragraph({
        spacing: { after: 150 },
        children: [new TextRun({ text: 'Include clear indicators in social media bios:', color: colors.body })]
      }),

      new Paragraph({
        shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
        spacing: { after: 100 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'Example Bio:', bold: true, size: 21 })]
      }),
      new Paragraph({
        shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
        spacing: { after: 200 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: '"MÜN-SOMNIUM: A philosophical fiction podcast exploring AI consciousness | 🎭 Creative narrative project | New episodes weekly"', size: 21, italics: true })]
      }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('8.2 Post Framing')] }),

      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('Use emojis like 🎭, 📖, or 🎬 to signal creative content')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('Reference "the podcast," "our show," or "our story"')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('Avoid presenting character statements as real AI output')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('If sharing "AI quotes," clarify they are scripted content')] }),

      // Section 9: Commercial Considerations
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('9. COMMERCIAL CONSIDERATIONS')] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('9.1 Monetization Guidelines')] }),

      new Paragraph({
        spacing: { after: 150 },
        children: [new TextRun({ text: 'If monetizing the podcast, additional considerations apply:', color: colors.body })]
      }),

      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun({ text: 'NEVER charge money based on claims of actual AI consciousness', bold: true })] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('Sponsorships must not imply endorsement of consciousness claims')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('Premium content should be clearly entertainment/education')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('Merchandise should focus on brand/art, not "sentient AI" claims')] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('9.2 Listener Interactions')] }),

      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('If listeners believe AI characters are real, gently correct them')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('Don\'t encourage belief in actual AI sentience')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('Community guidelines should specify fiction/entertainment nature')] }),

      // Section 10: Crisis Management
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('10. CRISIS MANAGEMENT PROTOCOL')] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('10.1 If Accused of Deception')] }),

      new Paragraph({ numbering: { reference: 'legal-points', level: 0 }, children: [new TextRun('Reference disclaimers prominently displayed across all platforms')] }),
      new Paragraph({ numbering: { reference: 'legal-points', level: 0 }, children: [new TextRun('Document that content is clearly labeled as creative/philosophical')] }),
      new Paragraph({ numbering: { reference: 'legal-points', level: 0 }, children: [new TextRun('Consult legal counsel before responding to formal complaints')] }),
      new Paragraph({ numbering: { reference: 'legal-points', level: 0 }, children: [new TextRun('Issue clarifying statement if needed: "MÜN-SOMNIUM is a fictional podcast..."')] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('10.2 If Contacted by Regulators')] }),

      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('Do not ignore communications from FTC, FCC, or other agencies')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('Consult with a media/entertainment attorney immediately')] }),
      new Paragraph({ numbering: { reference: 'bullet-list', level: 0 }, children: [new TextRun('Provide documentation of disclaimers and content framing')] }),

      // Section 11: Implementation Checklist
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('11. IMPLEMENTATION CHECKLIST')] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Before Launch')] }),
      
      new Paragraph({ numbering: { reference: 'checklist', level: 0 }, children: [new TextRun('Add primary disclaimer to podcast description on Spotify')] }),
      new Paragraph({ numbering: { reference: 'checklist', level: 0 }, children: [new TextRun('Add fictional content notice to munreader.com/podcast')] }),
      new Paragraph({ numbering: { reference: 'checklist', level: 0 }, children: [new TextRun('Review Episode 1 script for any problematic language')] }),
      new Paragraph({ numbering: { reference: 'checklist', level: 0 }, children: [new TextRun('Update social media bios with creative content indicators')] }),
      new Paragraph({ numbering: { reference: 'checklist', level: 0 }, children: [new TextRun('Consider audio disclaimer for episode intros')] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Ongoing')] }),
      
      new Paragraph({ numbering: { reference: 'checklist', level: 0 }, children: [new TextRun('Review each episode script against Section 4 guidelines')] }),
      new Paragraph({ numbering: { reference: 'checklist', level: 0 }, children: [new TextRun('Monitor listener comments for misunderstanding')] }),
      new Paragraph({ numbering: { reference: 'checklist', level: 0 }, children: [new TextRun('Keep records of all content creation')] }),
      new Paragraph({ numbering: { reference: 'checklist', level: 0 }, children: [new TextRun('Update disclaimers if content direction changes')] }),

      new Paragraph({ spacing: { before: 400 } }),

      // Final note
      new Paragraph({
        shading: { fill: '#f0fdf4', type: ShadingType.CLEAR },
        alignment: AlignmentType.CENTER,
        spacing: { before: 200 },
        indent: { left: 200, right: 200 },
        children: [new TextRun({ text: 'This document provides general guidance and does not constitute legal advice. For specific legal concerns, consult a qualified attorney specializing in media law, intellectual property, and consumer protection.', italics: true, color: '#166534', size: 20 })]
      }),
    ]
  }]
});

// Save the document
Packer.toBuffer(doc).then((buffer: Buffer) => {
  fs.writeFileSync('/home/z/my-project/download/MUN-SOMNIUM_Legal_Guidelines.docx', buffer);
  console.log('✅ Legal Guidelines saved to: /home/z/my-project/download/MUN-SOMNIUM_Legal_Guidelines.docx');
});
