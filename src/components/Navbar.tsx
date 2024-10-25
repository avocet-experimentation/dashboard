/* for now, links to EventTable and FlagTable only
*/

import { Link } from "wouter";

export default function Navbar() {

  return (
    <div className="navbar">
      <ul>
        <li><Link href='/'>Feature Flags</Link></li>
        <li><Link href='/events'>Event Data</Link></li>
      </ul>
    </div>
  );
};
