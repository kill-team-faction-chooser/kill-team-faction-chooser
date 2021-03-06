import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {environment} from '../environments/environment';
import factionDataJsonFile from '../data/factions.json';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortable} from '@angular/material/sort';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'kill-team-faction-chooser';
  currentApplicationVersion = environment.appVersion;

  displayedFactionColumns: string[] = ['thumbnail', 'name', 'alignment', 'movement', 'combat', 'shoot', 'save', 'pointCost', 'numberOfMiniatures'];

  factionData: Faction[] = factionDataJsonFile;

  factionDataSource = new MatTableDataSource<Faction>(this.factionData);

  private paginator: MatPaginator;
  private sort: MatSort;

  // Form fields
  quickSearchField = '';
  searchFaction: Faction = new Faction();

  colorChoices: Color[] = [
    {value: 'black', viewValue: 'Black'},
    {value: 'blue', viewValue: 'Blue'},
    {value: 'bone', viewValue: 'Bone'},
    {value: 'brown', viewValue: 'Brown'},
    {value: 'gold', viewValue: 'Gold'},
    {value: 'green', viewValue: 'Green'},
    {value: 'leather', viewValue: 'Leather'},
    {value: 'metal', viewValue: 'Metal'},
    {value: 'orange', viewValue: 'Orange'},
    {value: 'pink', viewValue: 'Pink'},
    {value: 'purple', viewValue: 'Purple'},
    {value: 'red', viewValue: 'Red'},
    {value: 'silver', viewValue: 'Silver'},
    {value: 'turquoise', viewValue: 'Turquoise'},
    {value: 'white', viewValue: 'White'},
    {value: 'yellow', viewValue: 'Yellow'}
  ];

  specialistChoices: Specialist[] = [
    {value: 'combat', viewValue: 'Combat'},
    {value: 'communications', viewValue: 'Communications'},
    {value: 'demolition', viewValue: 'Demolition'},
    {value: 'heavy_support', viewValue: 'Heavy support'},
    {value: 'leader', viewValue: 'Leader'},
    {value: 'medic', viewValue: 'Medic'},
    {value: 'scout', viewValue: 'Scout'},
    {value: 'sniper', viewValue: 'Sniper'},
    {value: 'veteran', viewValue: 'Veteran'},
    {value: 'zealot', viewValue: 'Zealot'}
  ];

  alignmentLNCChoices: Alignment[] = [
    {value: 'lawful', viewValue: 'Lawful'},
    {value: 'neutral', viewValue: 'Neutral'},
    {value: 'chaotic', viewValue: 'Chaotic'}
  ];

  alignmentGNEChoices: Alignment[] = [
    {value: 'good', viewValue: 'Good'},
    {value: 'neutral', viewValue: 'Neutral'},
    {value: 'evil', viewValue: 'Evil'}
  ];

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.sort.sort(({id: 'name', start: 'asc'}) as MatSortable);
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  resetForm() {
    this.quickSearchField = '';
    this.searchFaction = new Faction();
    this.initNumberFields();

    this.search();
  }

  setDataSourceAttributes() {
    this.factionDataSource.paginator = this.paginator;
    this.factionDataSource.sort = this.sort;

    if (this.paginator && this.sort) {
      this.search();
    }
  }

  ngOnInit() {
    this.initNumberFields();

    this.setupSearchFilter();
  }

  initNumberFields() {
    this.searchFaction.minMove = 4;
    this.searchFaction.maxMove = 9;

    this.searchFaction.minCombat = 5;
    this.searchFaction.maxCombat = 2;

    this.searchFaction.minShoot = 6;
    this.searchFaction.maxShoot = 3;

    this.searchFaction.minSave = 7;
    this.searchFaction.maxSave = 3;

    this.searchFaction.minPointCost = 0;
    this.searchFaction.maxPointCost = 25;

    this.searchFaction.minNumberOfMiniatures = 2;
    this.searchFaction.maxNumberOfMiniatures = 20;

    this.searchFaction.specialists = [];
    this.searchFaction.specialists[this.getSpecialistIndex('leader')] = true;
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

  search() {
    this.factionDataSource.filter = '[' + this.quickSearchField + ']';
  }

  setupSearchFilter() {
    this.factionDataSource.filterPredicate =
      (faction: Faction, filters: string) => {
        const matchFilter = [];

        // Quick search
        if (filters !== '[]') {
          const columns = [faction.id, faction.name, faction.alignmentGNE, faction.alignmentLNC, faction.colors.toString()
            , faction.tags.toString(), faction.specialists.toString(), faction.tactics.toString()];
          const filterArray = filters.split(/\W+/);

          filterArray.forEach(filter => {
            const customFilter = [];
            columns.forEach(column => customFilter.push(column.toLowerCase().includes(filter.toLowerCase())));
            matchFilter.push(customFilter.some(Boolean)); // OR
          });
        }

        if (this.searchFaction.minMove) {
          const movement = this.searchFaction.minMove;
          const customFilter = [];
          customFilter.push(faction.minMove >= movement);
          matchFilter.push(customFilter.some(Boolean)); // OR
        }

        if (this.searchFaction.maxMove) {
          const movement = this.searchFaction.maxMove;
          const customFilter = [];
          customFilter.push(faction.maxMove <= movement);
          matchFilter.push(customFilter.some(Boolean)); // OR
        }

        if (this.searchFaction.minCombat) {
          const combat = this.searchFaction.minCombat;
          const customFilter = [];
          customFilter.push(faction.minCombat <= combat);
          matchFilter.push(customFilter.some(Boolean)); // OR
        }

        if (this.searchFaction.maxCombat) {
          const combat = this.searchFaction.maxCombat;
          const customFilter = [];
          customFilter.push(faction.maxCombat >= combat);
          matchFilter.push(customFilter.some(Boolean)); // OR
        }

        if (this.searchFaction.minShoot) {
          const shoot = this.searchFaction.minShoot;
          const customFilter = [];
          customFilter.push(faction.minShoot <= shoot);
          matchFilter.push(customFilter.some(Boolean)); // OR
        }

        if (this.searchFaction.maxShoot) {
          const shoot = this.searchFaction.maxShoot;
          const customFilter = [];
          customFilter.push(faction.maxShoot >= shoot);
          matchFilter.push(customFilter.some(Boolean)); // OR
        }

        if (this.searchFaction.colors) {
          const color = this.searchFaction.colors.toString();

          const customFilter = [];
          for (let i = 0; i < faction.colors.length; i++) {
            customFilter.push(faction.colors[i] === color);
          }

          matchFilter.push(customFilter.some(Boolean)); // OR
        }

        if (this.searchFaction.alignmentLNC) {
          const alignment = this.searchFaction.alignmentLNC.toString();

          const customFilter = [];
          customFilter.push(faction.alignmentLNC === alignment);

          matchFilter.push(customFilter.some(Boolean)); // OR
        }

        if (this.searchFaction.alignmentGNE) {
          const alignment = this.searchFaction.alignmentGNE.toString();

          const customFilter = [];
          customFilter.push(faction.alignmentGNE === alignment);

          matchFilter.push(customFilter.some(Boolean)); // OR
        }

        if (this.searchFaction.minPointCost) {
          const pointCost = this.searchFaction.minPointCost;
          const customFilter = [];
          customFilter.push(faction.minPointCost >= pointCost);
          matchFilter.push(customFilter.some(Boolean)); // OR
        }

        if (this.searchFaction.maxPointCost) {
          const pointCost = this.searchFaction.maxPointCost;
          const customFilter = [];
          customFilter.push(faction.maxPointCost <= pointCost);
          matchFilter.push(customFilter.some(Boolean)); // OR
        }

        if (this.searchFaction.minSave) {
          const save = this.searchFaction.minSave;
          const customFilter = [];
          customFilter.push(faction.minSave <= save);
          matchFilter.push(customFilter.some(Boolean)); // OR
        }

        if (this.searchFaction.maxSave) {
          const save = this.searchFaction.maxSave;
          const customFilter = [];
          customFilter.push(faction.maxSave >= save);
          matchFilter.push(customFilter.some(Boolean)); // OR
        }

        if (this.searchFaction.minNumberOfMiniatures) {
          const numberOfMiniatures = this.searchFaction.minNumberOfMiniatures;
          const customFilter = [];
          customFilter.push(faction.minNumberOfMiniatures >= numberOfMiniatures);
          matchFilter.push(customFilter.some(Boolean)); // OR
        }

        if (this.searchFaction.maxNumberOfMiniatures) {
          const numberOfMiniatures = this.searchFaction.maxNumberOfMiniatures;
          const customFilter = [];
          customFilter.push(faction.maxNumberOfMiniatures <= numberOfMiniatures);
          matchFilter.push(customFilter.some(Boolean)); // OR
        }

        if (this.searchFaction.specialists) {
          const customFilter = [];
          for (let i = 0; i < this.searchFaction.specialists.length; i++) {
            if (this.searchFaction.specialists[i]) {
              customFilter.push(faction.specialists[i]);
            }
          }
          matchFilter.push(customFilter.every(Boolean)); // AND
        }

        return matchFilter.every(Boolean); // AND
      };
  }

  getSpecialistIndex(specialist: string) {
    for (let i = 0; i < this.specialistChoices.length; i++) {
      if (this.specialistChoices[i].value === specialist) {
        return i;
      }
    }

    // Not found
    return -1;
  }
}

export class Faction {
  id: string;
  name: string;
  thumbnailpath: string;
  alignmentLNC: string;
  alignmentGNE: string;
  minMove: number;
  maxMove: number;
  colors: string[];
  minCombat: number;
  maxCombat: number;
  minShoot: number;
  maxShoot: number;
  minPointCost: number;
  maxPointCost: number;
  minSave: number;
  maxSave: number;
  tags: string[];
  minNumberOfMiniatures: number;
  maxNumberOfMiniatures: number;
  specialists: boolean[];
  tactics: string[];
}

export class Color {
  value: string;
  viewValue: string;
}

export class Alignment {
  value: string;
  viewValue: string;
}

export class Specialist {
  value: string;
  viewValue: string;
}
