import { Component, Input, OnInit } from '@angular/core';
import { InnovationDevInfoBody } from '../../model/innovationDevInfoBody';

@Component({
  selector: 'app-estimates',
  templateUrl: './estimates.component.html',
  styleUrls: ['./estimates.component.scss']
})
export class EstimatesComponent implements OnInit {
  @Input() body = new InnovationDevInfoBody();
  constructor() {}

  ngOnInit(): void {}

  /*
Innovation development team estimates the total investment (in-cash + in-kind) in innovation development made by the leading initiative and the contributing initiatives during the reporting period.
Includes Initiative funds allocated to CGIAR and/or partners.
Innovation development team works with contributing Initiatives to estimate the total (co-) investment (in-cash + in-kind) in innovation development made by each of the contributing Initiatives during the reporting period.

Innovation development team works with W3/ bilateral projects to estimate the total (co-) investment (in-cash + in-kind) in innovation development made by each of the contributing W3/ Bilaterals during the reporting period
Includes W3/ Bilateral funds allocated to CGIAR and/or partners


Innovation development team works with partnersprojects to estimate the total (co-) investment (in-cash + in-kind) in innovation development made by each partner during the reporting period
This concerns the investment of partner resources (in-cash and/or in-kind) that were not provided by CGIAR Initiatives or projects


Example:

return `<ul>
    <li>Ensure the description is understandable for a non-specialist reader.</li>
    <li>Avoid acronyms and technical jargon.</li>
    <li>Avoid repetition of the title.</li>
    </ul>`;

    the function should return an boject with three descriptions with html format as example above

  */

  headerDescriptions() {
    const n1 = `<ul>
    <li>Innovation development team estimates the total investment (in-cash + in-kind) in innovation development made by the leading initiative and the contributing initiatives during the reporting period.<li>
    <li>Includes Initiative funds allocated to CGIAR and/or partners.</li>
    <li>Innovation development team works with contributing Initiatives to estimate the total (co-) investment (in-cash + in-kind) in innovation development made by each of the contributing Initiatives during the reporting period.</li>
    <ul>`;
    const n2 = `<ul>
    <li>Innovation development team works with W3/ bilateral projects to estimate the total (co-) investment (in-cash + in-kind) in innovation development made by each of the contributing W3/ Bilaterals during the reporting period</li>
    <li>Includes W3/ Bilateral funds allocated to CGIAR and/or partners</li>
    <ul>`;
    const n3 = `<ul>
    <li>Innovation development team works with partnersprojects to estimate the total (co-) investment (in-cash + in-kind) in innovation development made by each partner during the reporting period</li>
    <li>This concerns the investment of partner resources (in-cash and/or in-kind) that were not provided by CGIAR Initiatives or projects</li>
    <ul>`;
    return { n1, n2, n3 };
  }
}