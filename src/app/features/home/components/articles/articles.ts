import {Component, computed, inject, input, signal} from '@angular/core';
import {Router} from '@angular/router';
import {ArticlesService} from './services/articles.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {Article} from '@features/home/components/articles/components/article';
import {SkeletonArticle} from '@features/home/components/articles/components/skeletton/skeleton';
import {AuthorsService} from '@features/home/components/articles/services/authors.service';
import {ArrowDown, ArrowUp, ArrowUpDown, Funnel, LucideAngularModule} from 'lucide-angular';

type SortField = 'author' | 'title';
type SortDirection = 'asc' | 'desc';

@Component({
    selector: "app-articles",
    imports: [
        Article,
        SkeletonArticle,
        LucideAngularModule
    ],
    templateUrl: "./articles.html"
})

export class Articles {
    readonly author = input<string>('')
    protected readonly _router = inject(Router)
    protected readonly selectedAuthor = signal<string>('all');
    protected readonly sortField = signal<SortField>('title');
    protected readonly sortDirection = signal<SortDirection>('asc');
    protected readonly _articlesService = inject(ArticlesService)
    protected readonly _authorsService = inject(AuthorsService)
    protected readonly authors = toSignal(this._authorsService.getAllAuthors(), {initialValue: []})
    protected readonly articles = toSignal(this._articlesService.getArticles(), {initialValue: []});

    readonly filteredArticles = computed(() => {
        const author = this.selectedAuthor();
        const field = this.sortField();
        const direction = this.sortDirection();
        const sortType = direction === 'asc' ? 'ASC' : 'DESC';
        let list = [...this.articles()];

        if (field === 'author') {
            list = this._articlesService.getSortedByAuthors(sortType);
        }

        if (field === "title") {
            list = this._articlesService.getSortedByTitle(sortType)
        }

        if (author !== 'all') {
            list = list.filter(a => a.author?.fullName === author);
        }


        this._router.navigate([], {
            queryParams: {
                author,
                sortBy: field,
                sortDir: direction
            },
            queryParamsHandling: 'merge'
        })

        return list
    });
    protected readonly isLoading = computed(() => this.articles().length === 0);
    protected readonly skeletonArray = computed(() => Array.from({length: 6}));
    protected readonly Funnel = Funnel;
    protected readonly ArrowUpDown = ArrowUpDown;
    protected readonly ArrowUp = ArrowUp;
    protected readonly ArrowDown = ArrowDown;

    onSelectArtistes(event: Event): void {
        const select = event.target as HTMLSelectElement;
        const value = select.value;
        this.selectedAuthor.set(value);
    }

    onSelectSortField(event: Event): void {
        const select = event.target as HTMLSelectElement;
        const value = select.value as SortField;
        this.sortField.set(value);
    }

    toggleSortDirection(): void {
        this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    }
}
