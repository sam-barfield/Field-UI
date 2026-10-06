// title: Long-form content
// description: Wrap Markdown or CMS HTML in Prose to style headings, lists, quotes, images and tables. With an HTML string, use dangerouslySetInnerHTML (sanitise it first).
import { Prose } from '@sam.barfield/field-react';

export default function ProseArticle() {
  return (
    <Prose as="article" className="example-wide">
      <h2>Our story</h2>
      <p>
        Hearth started in 2019 with one oven and a <a href="#/components/prose">market stall</a>. Today we bake
        <strong> over 400 loaves a day</strong> and roast our own coffee next door.
      </p>
      <h3>What we believe</h3>
      <ul>
        <li>Long fermentation, local flour, no shortcuts.</li>
        <li>Coffee bought directly from growers we have met.</li>
        <li>Nothing goes to waste: day-old bread goes to the community fridge.</li>
      </ul>
      <blockquote>Good bread takes time. We would rather sell out than cut corners.</blockquote>
      <h3>Opening hours</h3>
      <table>
        <thead>
          <tr><th>Day</th><th>Hours</th></tr>
        </thead>
        <tbody>
          <tr><td>Monday – Friday</td><td>7am – 4pm</td></tr>
          <tr><td>Saturday – Sunday</td><td>8am – 3pm</td></tr>
        </tbody>
      </table>
    </Prose>
  );
}
