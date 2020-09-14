<template>
  <Layout>
    <!-- Page Header -->
    <header
      class="masthead"
      :style="{background: `url(http://localhost:1337${$page.post.cover.url})`}"
    >
      <div class="overlay"></div>
      <div class="container">
        <div class="row">
          <div class="col-lg-8 col-md-10 mx-auto">
            <div class="post-heading">
              <h1>{{$page.post.title}}</h1>
              <span class="meta">
                Posted by
                <a
                  href="#"
                >{{$page.post.created_by.firstname + $page.post.created_by.lastname}}</a>
                on {{$page.post.created_at}}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Post Content -->
    <article>
      <div class="container">
        <div class="row">
          <div class="col-lg-8 col-md-10 mx-auto" v-html="mdToHtml($page.post.content)"></div>
        </div>
      </div>
    </article>
  </Layout>
</template>

<page-query>
query($id: ID!) {
  post: strapiPost(id: $id) {
    id
    title
    content
    cover {
      url
    }
    tags {
      id
      title
    }
    created_at
    created_by {
      id
      firstname
      lastname
    }
  }
}
</page-query>

<script>
import MarkDownIt from "markdown-it";
const md = new MarkDownIt();
export default {
  name: "PostPage",
  methods: {
    mdToHtml(markdown) {
      return md.render(markdown);
    }
  }
};
</script>

<style></style>