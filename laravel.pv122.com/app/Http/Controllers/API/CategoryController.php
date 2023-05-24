<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Validator;
use Storage;
use App\Models\User;
class CategoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index','edit','indexId','store']]);
    }
    /**
     * @OA\Get(
     *     tags={"Category"},
     *     path="/api/category",
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         required=true,
     *         @OA\Schema(
     *             type="string"
     *         ),
     *         description="Page number default 1"
     *     ),
     *     @OA\Response(response="200", description="List Categories.")
     * )
     */
    public function index()
    {
        $list = Category::paginate(2);
        return response()->json($list,200);
    }
    /**
     * @OA\Post(
     *     tags={"Category"},
     *     path="/api/category",
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"image", "name"},
     *                 @OA\Property(
     *                     property="image",
     *                     type="string",
     *                     format="binary"
     *                 ),
     *                 @OA\Property(
     *                     property="name",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="description",
     *                     type="string"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Add Category.")
     * )
     */
    public function store(Request $request)
    {
        //отримуємо дані із запиту(name, image, description)
        $input = $request->all();
        $messages = array(
            'name.required' => 'Вкажіть назву категорії!',
            'description.required' => 'Вкажіть опис категорії!',
            'image.required' => 'Оберіть фото категорії!'
        );
        $validator = Validator::make($input, [
            'name' => 'required',
            'description' => 'required',
            'image' => 'required',
        ], $messages);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
        $filename = uniqid().'.'.$request->file("image")->getClientOriginalExtension();
        Storage::disk('local')->put("public/uploads/".$filename,file_get_contents($request->file("image")));
        $input["image"] = $filename;
        $category = Category::create($input);
        return response()->json($category);
    }
    /**
     * @OA\Delete(
     *     tags={"Category"},
     *     path="/api/category/delete/{id}",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the category to delete",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(response="200", description="Delete Category.")
     * )
     */
    public function destroy($id)
    {
        $file = Category::findOrFail($id);
        $fileName = "public/uploads/".$file["image"];
        // Видалення файлу
        if (Storage::exists($fileName)) {
            Storage::delete($fileName);
        }

        // Видалення елемента з бази даних
        $file->delete();

        // Опціонально поверніть відповідь або редиректіть користувача
    }

    public function indexId($id){
        return $file = Category::findOrFail($id);
    }
    /**
     * @OA\Post(
     *     tags={"Category"},
     *     path="/api/category/edit/{id}",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the category to update",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"name"},
     *                 @OA\Property(
     *                     property="image",
     *                     type="string",
     *                     format="binary"
     *                 ),
     *                 @OA\Property(
     *                     property="name",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="description",
     *                     type="string"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Update Category.")
     * )
     */

    public function edit($id, Request $request)
    {
        //отримуємо дані із запиту(name, image, description)
        $input = $request->all();
        $name = $request->input('name');
        $file = Category::findOrFail($id);

        $messages = array(
            'name.required' => 'Вкажіть назву категорії!',
            'description.required' => 'Вкажіть опис категорії!'

        );
        $validator = Validator::make($input, [
            'name' => 'required',
            'description' => 'required'

        ], $messages);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        if ($input['image'] != null && $input['image'] != $file->image)
        {
            $fileName = "public/uploads/" . $file->image;
        // Видалення файлу
        if (Storage::exists($fileName)) {
            Storage::delete($fileName);
        }


        $filename = uniqid() . '.' . $request->file("image")->getClientOriginalExtension();
        Storage::disk('local')->put("public/uploads/" . $filename, file_get_contents($request->file("image")));
        $file->image = $filename;
        }
        $file->name = $input['name'];
        $file->description = $input['description'];
        $file->save();

        return response()->json($file);
    }
}
